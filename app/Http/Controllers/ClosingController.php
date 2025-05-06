<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\Closing;
use App\Models\Entry;
use App\Models\Location;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClosingController extends Controller
{
    public function closingBookList(Request $request)
    {
        $q = $request->input('q');
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $closings = Closing::latest()
            ->when($q, function ($query) use ($q) {
                $query->where('parent_account_name', 'like', '%' . $q . '%');
            })
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
            // Ambil semua lokasi beserta entry-nya
            $locations = Location::with(['entries' => function ($query) {
                $query->where('status', 'posting')
                    ->where('is_closing', false)->where('user_id', '!=', null)
                    ->orderBy('entries_date');
            }])->get();

            foreach ($locations as $location) {
                // Ambil entry pertama yang belum di-closing
                $entryToClose = $location->entries->first();

                if ($entryToClose) {
                    $entryDate = Carbon::parse($entryToClose->entries_date);
                    $month = $entryDate->format('m');
                    $year = $entryDate->format('Y');
                    return ResponseFormatter::success($month);

                    // // Update semua entry di bulan & lokasi itu jadi is_closing = true
                    // Entry::where('location_id', $location->id)
                    //     ->whereMonth('entry_date', $month)
                    //     ->whereYear('entry_date', $year)
                    //     ->update(['is_closing' => true]);

                    // // Tambah logik lainnya (jika perlu, misal: insert jurnal laba ditahan)
                }
            }

            DB::commit();

            return redirect()->back()->with('message', [
                'type' => 'success',
                'message' => 'Proses closing berhasil dilakukan untuk bulan terlama.',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with('message', [
                'type' => 'error',
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function openBook(Request $request) {}
}
