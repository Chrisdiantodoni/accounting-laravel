<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\Closing;
use App\Models\Entry;
use App\Models\Location;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClosingController extends Controller
{
    public function closingBookList(Request $request)
    {
        $q = $request->input('q');
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $closings = Closing::latest()->with(['location', 'user'])
            ->when($q, function ($query) use ($q) {
                $query->where('parent_account_name', 'like', '%' . $q . '%');
            })->orderBy('month', 'asc')->orderBy('year', 'asc')
            ->paginate($limit);

        $filters = [
            'limit' => $limit,
            'q' => $q,
            'page' => $page,
        ];
        return Inertia::render('Dashboard/Main/ListCloseBook', compact('closings', 'filters'));
    }

    public function getLocationClosing(Request $request)
    {

        $location = Location::latest()->with(['closing_books']);
        return ResponseFormatter::success($location,);
    }

    public function closeBook(Request $request)
    {
        DB::beginTransaction();

        try {
            $location_id = $request->input('location_id');

            // Ambil semua lokasi beserta entry-nya
            $entries = Entry::where('location_id', $location_id)
                ->where('is_closing', false)
                ->where('status', 'posting')
                ->whereNotNull('user_id')
                ->orderBy('entries_date', 'asc')->first();
            // Ambil entry pertama yang belum di-closing

            if ($entries) {
                $entryDate = Carbon::parse($entries->entries_date);
                $month = $entryDate->format('m');
                $year = $entryDate->format('Y');

                $stillCreated = Entry::where('location_id', $location_id)
                    ->whereMonth('entries_date', $month)
                    ->whereYear('entries_date', $year)
                    ->where('status', 'create')
                    ->exists();

                if ($stillCreated) {
                    return redirect()->back()->with('message', [
                        'toast_type' => 'warning',
                        'alert_type' => 'toast',
                        'message' => 'Masih ada entry berstatus "create" di bulan ini. Harap selesaikan sebelum melakukan closing.',
                    ]);
                }
                // Update semua entry di bulan & lokasi itu jadi is_closing = true
                Entry::where('location_id', $location_id)
                    ->whereMonth('entries_date', $month)
                    ->whereYear('entries_date', $year)
                    ->update(['is_closing' => true]);

                Closing::create([
                    'location_id' => $location_id,
                    'month' => $month,
                    'year' => $year,
                    'action' => 'TUTUP BUKU',
                    'user_id' => Auth::user()->user_id,
                    'is_closing' => true,
                ]);
            } else {
                return redirect()->back()->with('message', [
                    'toast_type' => 'warning',
                    'alert_type' => 'toast',
                    'message' => 'Entry tidak ditemukan',
                ]);
            }

            DB::commit();

            return redirect()->back()->with('message', [
                'type' => 'success',
                'message' => 'Proses closing berhasil dilakukan.',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with('message', [
                'type' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }
    public function openBook(Request $request)
    {
        DB::beginTransaction();

        try {
            $location_id = $request->input('location_id');
            $notes = $request->input('notes');

            $entries = Entry::where('location_id', $location_id)
                ->where('is_closing', true)
                ->where('status', 'posting')
                ->whereNotNull('user_id')
                ->orderByDesc('entries_date')->first();

            // Ambil entry terakhir yang sudah di-closing
            // return ResponseFormatter::success($entries->entries_date);

            if ($entries) {
                $entryDate = Carbon::parse($entries->entries_date);
                $month = $entryDate->format('m');
                $year = $entryDate->format('Y');

                // Buka kembali (set is_closing = false)
                Entry::where('location_id', $location_id)
                    ->whereMonth('entries_date', $month)
                    ->whereYear('entries_date', $year)
                    ->update(['is_closing' => false]);

                Closing::create([
                    'location_id' => $location_id,
                    'month' => $month,
                    'year' => $year,
                    'user_id' => Auth::user()->user_id,
                    'action' => 'BUKA BUKU',
                    'is_closing' => false,
                    'notes' => $notes,
                ]);
            } else {
                return redirect()->back()->with('message', [
                    'toast_type' => 'warning',
                    'alert_type' => 'toast',
                    'message' => 'Entry tidak ditemukan',
                ]);
            }

            DB::commit();

            return redirect()->back()->with('message', [
                'type' => 'success',
                'message' => 'Proses open book berhasil dilakukan untuk bulan terakhir.',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with('message', [
                'type' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }
}
