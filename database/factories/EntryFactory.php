<?php

namespace Database\Factories;

use App\Models\Entry;
use App\Models\Ledger;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EntryFactory extends Factory
{
    protected $model = Entry::class;

    public function definition(): array
    {
        return [
            'document_number' => $this->faker->unique()->numerify('2025.###.LR.###'),
            'status' => 'create',
            'entries_date' => $this->faker->date(),
            'location_id' => Location::inRandomOrder()->value('id'),
            'user_posting_id' => null,
            'posting_at' => null,
            'debit' => 0,
            'credit' => 0,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Entry $entry) {
            $itemCount = 4;
            $debits = collect();
            $credits = collect();

            $ledgerIds = Ledger::pluck('id')->shuffle();
            if ($ledgerIds->isEmpty()) {
                // Ledger kosong, skip agar tidak buat entry_items tanpa ledger
                return;
            }

            $userId = User::inRandomOrder()->value('user_id');
            $entryDate = $entry->entries_date;

            for ($i = 0; $i < $itemCount - 1; $i++) {
                $amount = fake()->numberBetween(10000, 50000);
                $type = fake()->randomElement(['Debit', 'Kredit']);
                if ($type === 'Debit') {
                    $debits->push($amount);
                    $credits->push(0);
                } else {
                    $debits->push(0);
                    $credits->push($amount);
                }
            }

            $totalDebit = $debits->sum();
            $totalCredit = $credits->sum();
            $diff = abs($totalDebit - $totalCredit);

            if ($totalDebit > $totalCredit) {
                $debits->push(0);
                $credits->push($diff);
            } else {
                $debits->push($diff);
                $credits->push(0);
            }

            foreach ($debits as $i => $debit) {
                $credit = $credits[$i];
                $entry->entry_items()->create([
                    'ledger_id' => $ledgerIds[$i % $ledgerIds->count()],
                    'entry_date' => $entryDate,
                    'user_id' => $userId,
                    'debit' => $debit,
                    'credit' => $credit,
                    'type' => $debit > 0 ? 'Debit' : 'Kredit',
                    'notes' => fake()->sentence(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $entry->update([
                'debit' => $entry->entry_items->sum('debit'),
                'credit' => $entry->entry_items->sum('credit'),
            ]);
        });
    }
}
