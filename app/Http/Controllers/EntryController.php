<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\Entry;
use App\Models\EntryItems;
use App\Models\EntryLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Services\ProfitLossService;


class EntryController extends Controller
{
    public function entryList(Request $request)
    {
        $q = $request->input('q');
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $user = Auth::user();
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $selectedLocationId = $user->locations
            ->firstWhere('pivot.isSelected', true)?->id;
        $entries = Entry::with(['location'])->where('location_id', $selectedLocationId)
            ->where('status', 'create')
            ->when($q, function ($query) use ($q) {
                $query->where('document_number',  'like', '%' . $q . '%');
            })->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->paginate($limit);

        $filters = [
            'limit' => $limit,
            'q' => $q,
            'page' => $page,
        ];
        return Inertia::render('Dashboard/Main/ListEntry', compact('entries', 'filters'));
    }


    public function postingList(Request $request)
    {
        $q = $request->input('q');
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $user = Auth::user();
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $selectedLocationId = $user->locations
            ->firstWhere('pivot.isSelected', true)?->id;
        $postings = Entry::with(['location'])->where('location_id', $selectedLocationId)
            ->where('status', 'posting')
            ->when($q, function ($query) use ($q) {
                $query->where('document_number',  'like', '%' . $q . '%');
            })->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->paginate($limit);

        $filters = [
            'limit' => $limit,
            'q' => $q,
            'page' => $page,
        ];
        return Inertia::render('Dashboard/Main/ListPosting', compact('postings', 'filters'));
    }

    public function addEntry()
    {
        return Inertia::render('Dashboard/Main/Form/Entry');
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $selectedLocationId = $user->locations
            ->firstWhere('pivot.isSelected', true)?->id;
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'document_number' => 'required',
                'entries_date' => 'required|date',
                'entries' => 'required|array|min:1',
                'entries.*.ledger_id'  => 'required|exists:ledgers,id',
                'entries.*.notes'  => 'required',
                'entries.*.type' => 'required|in:debit,kredit',
            ], [
                'document_number.required' => 'No. Bukti wajib diisi.',
                'entries_date.required' => 'Tanggal wajib diisi.',
                'entries.*.ledger_id.required' => 'Perkiraan wajib dipilih.',
                'entries.*.notes.required' => 'Keterangan wajib diisi.',
                'entries.*.type.required' => 'Jenis entry wajib dipilih.',
            ]);

            // Validasi lanjutan berdasarkan type
            $entries = $request->input('entries', []);
            foreach ($entries as $i => $entry) {
                if (isset($entry['type'])) {
                    if ($entry['type'] === 'debit' && empty($entry['debit'])) {
                        $validator->errors()->add("entries.$i.debit", 'Debet wajib diisi untuk tipe debit.');
                    }

                    if ($entry['type'] === 'kredit' && empty($entry['credit'])) {
                        $validator->errors()->add("entries.$i.credit", 'Kredit wajib diisi untuk tipe kredit.');
                    }
                }
            }
            $errors = implode(', ', $validator->errors()->all());

            if ($validator->fails()) {
                $notification = array(
                    'type' => 'error',
                    'message' => $errors
                );
                return redirect()->back()->withErrors($validator)->with('message',  $notification);
            }
            $document_number = $request->input('document_number');
            $entries_date = $request->input('entries_date');
            $debit = $request->input('debit');
            $credit = $request->input('credit');
            $notes = $request->input('notes');

            $entries_list = $request->input('entries');


            $entry = Entry::create([
                'document_number' => $document_number,
                'entries_date' => $entries_date,
                'debit' => $debit ?? 0,
                'credit' => $credit ?? 0,
                'location_id' => $selectedLocationId,
                'user_id' => $user->user_id,
                'notes' => $notes,
                'status' => 'create'
            ]);

            foreach ($entries_list as $entries) {
                EntryItems::create([
                    'type' => $entries['type'],
                    'entries_id' => $entry->id,
                    'entry_date' => $entries_date,
                    'ledger_id' => $entries['ledger_id'],
                    'user_id' => $user->user_id,
                    'debit' => $entries['debit'] ?? 0,
                    'credit' => $entries['credit'] ?? 0,
                    'notes' => $entries['notes']
                ]);
            }
            EntryLog::create([
                'user_id' => $user->user_id,
                'action' => strtoupper($user->name) . ' BUAT ENTRY DATA',
                'entries_id' => $entry->id,
            ]);
            DB::commit();

            $notification = array(
                'type' => 'success',
                'message' =>  'Entry Data ditambahkan'
            );
            return redirect()->intended(route('show.entries', $entry->id))->with('message', $notification);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $selectedLocationId = $user->locations
            ->firstWhere('pivot.isSelected', true)?->id;
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'document_number' => 'required',
                'entries_date' => 'required|date',
                'entries' => 'required|array|min:1',
                'entries.*.ledger_id'  => 'required|exists:ledgers,id',
                'entries.*.notes'  => 'required',
                'entries.*.type' => 'required|in:debit,kredit',
            ], [
                'document_number.required' => 'No. Bukti wajib diisi.',
                'entries_date.required' => 'Tanggal wajib diisi.',
                'entries.*.ledger_id.required' => 'Perkiraan wajib dipilih.',
                'entries.*.notes.required' => 'Keterangan wajib diisi.',
                'entries.*.type.required' => 'Jenis entry wajib dipilih.',
            ]);

            // Validasi lanjutan berdasarkan type
            $entries = $request->input('entries', []);
            foreach ($entries as $i => $entry) {
                if (isset($entry['type'])) {
                    if ($entry['type'] === 'debit' && empty($entry['debit'])) {
                        $validator->errors()->add("entries.$i.debit", 'Debet wajib diisi untuk tipe debit.');
                    }

                    if ($entry['type'] === 'kredit' && empty($entry['credit'])) {
                        $validator->errors()->add("entries.$i.credit", 'Kredit wajib diisi untuk tipe kredit.');
                    }
                }
            }
            $errors = implode(', ', $validator->errors()->all());

            if ($validator->fails()) {
                $notification = array(
                    'type' => 'error',
                    'message' => $errors
                );
                return redirect()->back()->withErrors($validator)->with('message',  $notification);
            }
            $document_number = $request->input('document_number');
            $entries_date = $request->input('entries_date');
            $debit = $request->input('debit');
            $credit = $request->input('credit');
            $notes = $request->input('notes');

            $entries_list = $request->input('entries');
            $entry = Entry::find($id);
            $entry->update([
                'document_number' => $document_number,
                'entries_date' => $entries_date,
                'debit' => $debit ?? 0,
                'credit' => $credit ?? 0,
                'location_id' => $selectedLocationId,
                'notes' => $notes,
                'user_edit_id' => $user->user_id,
                'edited_at' => Carbon::now(),
            ]);

            $existingEntryItemIds = EntryItems::where('entries_id', $entry->id)->pluck('id')->toArray();

            $submittedIds = collect($entries_list)
                ->filter(fn($item) => isset($item['id']))
                ->pluck('id')
                ->toArray();

            // Hitung ID yang harus dihapus
            $toDelete = array_diff($existingEntryItemIds, $submittedIds);
            EntryItems::whereIn('id', $toDelete)->delete();

            foreach ($entries_list as $item) {
                if (isset($item['id'])) {
                    $entryItem = EntryItems::find($item['id']);
                    if ($entryItem) {
                        $entryItem->update([
                            'type' => $item['type'],
                            'ledger_id' => $item['ledger_id'],
                            'debit' => $item['debit'] ?? 0,
                            'credit' => $item['credit'] ?? 0,
                            'notes' => $item['notes'],
                        ]);
                        continue;
                    }
                }

                EntryItems::create([
                    'type' => $item['type'],
                    'entries_id' => $entry->id,
                    'entry_date' => $entries_date,
                    'ledger_id' => $item['ledger_id'],
                    'user_id' => $user->user_id,
                    'debit' => $item['debit'] ?? 0,
                    'credit' => $item['credit'] ?? 0,
                    'notes' => $item['notes'],
                ]);
            }

            EntryLog::create([
                'user_id' => $user->user_id,
                'action' => strtoupper($user->name) . ' UPDATE ENTRY',
                'entries_id' => $entry->id,
            ]);
            DB::commit();
            $notification = array(
                'type' => 'success',
                'message' =>  'Entry Data diperbarui'
            );
            return redirect()->intended(route('show.entries', $entry->id))->with('message', $notification);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }

    public function showEntry($id)
    {
        $entry = Entry::with(['entry_items.user', 'entry_items.ledger', 'entry_logs', 'user_edit', 'user_posting'])->find($id);
        return Inertia::render('Dashboard/Main/Detail/Entry', compact('entry'));
    }
    public function showPosting($id)
    {
        $posting = Entry::with(['entry_items.user', 'entry_items.ledger', 'entry_logs', 'user_edit', 'user_posting'])->find($id);
        return Inertia::render('Dashboard/Main/Detail/Posting', compact('posting'));
    }

    public function checkDocumentNumber(Request $request)
    {
        try {
            $user = Auth::user();
            $selectedLocationId = $user->locations
                ->firstWhere('pivot.isSelected', true)?->id;
            $document_number = $request->input('document_number');
            $entry = Entry::where('document_number', $document_number)->where('location_id', $selectedLocationId)->first();

            if ($entry) {
                return ResponseFormatter::error($entry, 'No. Bukti sudah terdaftar');
            } else {
                return ResponseFormatter::success(null, '');
            }
            //code...
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage(), 'Internal Server Error', 500);
        }
    }
    public function checkDocumentNumberEdit(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $selectedLocationId = $user->locations
                ->firstWhere('pivot.isSelected', true)?->id;
            $document_number = $request->input('document_number');
            $entry = Entry::where('document_number', $document_number)
                ->where('location_id', $selectedLocationId)
                ->where('id', '!=', $id)->first();

            if ($entry) {
                return ResponseFormatter::error($entry, 'No. Bukti sudah terdaftar');
            } else {
                return ResponseFormatter::success(null, '');
            }
            //code...
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage(), 'Internal Server Error', 500);
        }
    }

    public function editEntry($id)
    {

        $entry = Entry::with(['entry_items.user', 'entry_items.ledger', 'entry_logs'])->find($id);
        return Inertia::render('Dashboard/Main/Form/Entry', compact('entry'));
    }

    public function updateToPosting($id, ProfitLossService $profitLossService)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();
            $entry = Entry::with(['entry_items.ledger.child_account.parent_account', 'location'])->find($id);

            $entry->update([
                'status' => 'posting',
                'posting_at' => Carbon::now(),
                'user_posting_id' => $user->user_id,
            ]);
            $totalLabaBulanDitahan = $profitLossService->calculate(
                $entry->location->id,
                Carbon::now()->format('m'),
                Carbon::now()->format('Y')
            )['laba_sesudah_pendapatan'];
            $lastMonth = Carbon::now()->subMonth();

            $month = $lastMonth->format('m'); // bulan lalu, misal '04'
            $year = $lastMonth->format('Y');

            $totalLabaBulanLalu = $profitLossService->calculate(
                $entry->location->id,
                $month,
                $year,
            )['laba_sesudah_pendapatan'];

            $locationCode = $entry->location->code;

            $entriesDate = Carbon::parse($entry->entries_date);
            $year = $entriesDate->year;
            $monthCode = str_pad($entriesDate->month, 2, '0', STR_PAD_LEFT);
            $documentNumber = "{$year}.{$locationCode}.{$monthCode}.LR.001";

            $targetDocumentNumber = $documentNumber;
            $targetEntry = Entry::where('document_number', $targetDocumentNumber)->first();
            $entryItemsLabaBulanIniDebit = EntryItems::where('entries_id', $targetEntry->id)->where('type', 'Debit')->whereHas('ledger', function ($q) {
                $q->where('ledger_name', 'Laba Ditahan Bulan ini');
            })->first();
            $entryItemsLabaBulanIniKredit = EntryItems::where('entries_id', $targetEntry->id)->where('type', 'Kredit')->whereHas('ledger', function ($q) {
                $q->where('ledger_name', 'Laba Ditahan Bulan ini');
            })->first();
            $entryItemsLabaBulanLalu = EntryItems::where('entries_id', $targetEntry->id)->whereHas('ledger', function ($q) {
                $q->where('ledger_name', 'Laba Ditahan s.d Bulan Lalu');
            })->first();

            if ($entryItemsLabaBulanIniDebit) {
                $entryItemsLabaBulanIniDebit->update([
                    'debit' => $totalLabaBulanDitahan < 0 ? abs($totalLabaBulanDitahan) : 0,
                    'credit' => $totalLabaBulanDitahan >= 0 ? $totalLabaBulanDitahan : 0,
                ]);
            }

            // Update entry item untuk "Laba Ditahan s.d Bulan Lalu"
            if ($entryItemsLabaBulanLalu) {
                $entryItemsLabaBulanLalu->update([
                    'debit' => $totalLabaBulanLalu < 0 ? abs($totalLabaBulanLalu) : 0,
                    'credit' => $totalLabaBulanLalu >= 0 ? $totalLabaBulanLalu : 0,
                ]);
            }

            if ($entryItemsLabaBulanIniKredit && $entryItemsLabaBulanLalu) {
                $isLaluDebit = $entryItemsLabaBulanLalu->debit > 0;

                $entryItemsLabaBulanIniKredit->update([
                    'debit' => !$isLaluDebit ? abs($totalLabaBulanLalu) : 0,
                    'credit' => $isLaluDebit ? $totalLabaBulanLalu : 0,
                ]);
            }
            if ($targetEntry) {
                $totalDebit = $targetEntry->entry_items()->sum('debit');
                $totalCredit = $targetEntry->entry_items()->sum('credit');

                $targetEntry->update([
                    'debit' => $totalDebit,
                    'credit' => $totalCredit,
                ]);
            }
            $notification = array(
                'type' => 'success',
                'message' =>  'Entry Data dilakukan Posting'
            );
            DB::commit();
            return redirect()->intended(route('list.entries'))->with('message', $notification);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }

    public function unpostingEntry($id, ProfitLossService $profitLossService)
    {
        try {
            DB::beginTransaction();
            $entry = Entry::with(['entry_items.ledger.child_account.parent_account', 'location'])->find($id);

            $entry->update([
                'status' => 'create',
            ]);
            $excludeIds = $entry->entry_items->pluck('id')->toArray();
            $totalLabaBulanDitahan = $profitLossService->calculateWithExclusion(
                $entry->location->id,
                Carbon::now()->format('m'),
                Carbon::now()->format('Y'),
                $excludeIds,
            )['laba_sesudah_pendapatan'];
            $lastMonth = Carbon::now()->subMonth();

            $month = $lastMonth->format('m'); // bulan lalu, misal '04'
            $year = $lastMonth->format('Y');

            $totalLabaBulanLalu = $profitLossService->calculateWithExclusion(
                $entry->location->id,
                $month,
                $year,
                $excludeIds,

            )['laba_sesudah_pendapatan'];
            // return ResponseFormatter::success($totalLabaBulanDitahan);

            $locationCode = $entry->location->code;

            $entriesDate = Carbon::parse($entry->entries_date);
            $year = $entriesDate->year;
            $monthCode = str_pad($entriesDate->month, 2, '0', STR_PAD_LEFT);
            $documentNumber = "{$year}.{$locationCode}.{$monthCode}.LR.001";

            $targetDocumentNumber = $documentNumber;
            $targetEntry = Entry::where('document_number', $targetDocumentNumber)->first();
            $entryItemsLabaBulanIniDebit = EntryItems::where('entries_id', $targetEntry->id)->where('type', 'Debit')->whereHas('ledger', function ($q) {
                $q->where('ledger_name', 'Laba Ditahan Bulan ini');
            })->first();
            $entryItemsLabaBulanIniKredit = EntryItems::where('entries_id', $targetEntry->id)->where('type', 'Kredit')->whereHas('ledger', function ($q) {
                $q->where('ledger_name', 'Laba Ditahan Bulan ini');
            })->first();
            $entryItemsLabaBulanLalu = EntryItems::where('entries_id', $targetEntry->id)->whereHas('ledger', function ($q) {
                $q->where('ledger_name', 'Laba Ditahan s.d Bulan Lalu');
            })->first();

            if ($entryItemsLabaBulanIniDebit) {
                $entryItemsLabaBulanIniDebit->update([
                    'debit' => $totalLabaBulanDitahan < 0 ? abs($totalLabaBulanDitahan) : 0,
                    'credit' => $totalLabaBulanDitahan >= 0 ? $totalLabaBulanDitahan : 0,
                ]);
            }

            // Update entry item untuk "Laba Ditahan s.d Bulan Lalu"
            if ($entryItemsLabaBulanLalu) {
                $entryItemsLabaBulanLalu->update([
                    'debit' => $totalLabaBulanLalu < 0 ? abs($totalLabaBulanLalu) : 0,
                    'credit' => $totalLabaBulanLalu >= 0 ? $totalLabaBulanLalu : 0,
                ]);
            }

            if ($entryItemsLabaBulanIniKredit && $entryItemsLabaBulanLalu) {
                $isLaluDebit = $entryItemsLabaBulanLalu->debit > 0;

                $entryItemsLabaBulanIniKredit->update([
                    'debit' => !$isLaluDebit ? abs($totalLabaBulanLalu) : 0,
                    'credit' => $isLaluDebit ? $totalLabaBulanLalu : 0,
                ]);
            }
            if ($targetEntry) {
                $totalDebit = $targetEntry->entry_items()->sum('debit');
                $totalCredit = $targetEntry->entry_items()->sum('credit');

                $targetEntry->update([
                    'debit' => $totalDebit,
                    'credit' => $totalCredit,
                ]);
            }
            $notification = array(
                'type' => 'success',
                'message' =>  'Unposting Sukses'
            );
            DB::commit();
            return redirect()->intended(route('list.postings'))->with('message', $notification);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }

    public function deleteEntry($id)
    {
        try {
            $entry = Entry::find($id);
            $entry->delete();
            $notification = array(
                'type' => 'success',
                'message' =>  'Entry Data dihapus'
            );
            return redirect()->intended(route('list.entries'))->with('message', $notification);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }
}
