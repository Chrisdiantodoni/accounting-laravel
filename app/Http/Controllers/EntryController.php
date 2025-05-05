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

class EntryController extends Controller
{
    public function entryList(Request $request)
    {
        $q = $request->input('q');
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $user = Auth::user();
        $selectedLocationId = $user->locations
            ->firstWhere('pivot.isSelected', true)?->id;
        $entries = Entry::with(['location'])->where('location_id', $selectedLocationId)
            ->where('status', 'create')
            ->when($q, function ($query) use ($q) {
                $query->where('ledger_code', 'like', '%' . $q . '%');
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
        $selectedLocationId = $user->locations
            ->firstWhere('pivot.isSelected', true)?->id;
        $postings = Entry::with(['location'])->where('location_id', $selectedLocationId)
            ->where('status', 'posting')
            ->when($q, function ($query) use ($q) {
                $query->where('ledger_code', 'like', '%' . $q . '%');
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

    public function updateToPosting($id)
    {
        try {
            $user = Auth::user();
            $entry = Entry::find($id);
            $entry->update([
                'status' => 'posting',
                'posting_at' => Carbon::now(),
                'user_posting_id' => $user->user_id,
            ]);
            $notification = array(
                'type' => 'success',
                'message' =>  'Entry Data dilakukan Posting'
            );
            return redirect()->intended(route('list.entries',))->with('message', $notification);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }

    public function unpostingEntry($id)
    {
        try {
            $entry = Entry::find($id);
            $entry->update([
                'status' => 'create',
            ]);
            $notification = array(
                'type' => 'success',
                'message' =>  'Unposting Sukses'
            );
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
