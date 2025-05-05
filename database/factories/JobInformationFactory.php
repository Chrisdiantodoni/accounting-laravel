<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Position;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobInformation>
 */
class JobInformationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $position = Position::inRandomOrder()->first();
        $department = Department::inRandomOrder()->first();
        return [
            'position_id' => $position->position_id,
            'department_id' => $department->department_id,
            'date_start_work' => Carbon::now()->format('Y-m-d'), // Misalkan ini adalah tanggal mulai bekerja yang dihasilkan secara acak
            'job_status' => fake()->randomElement(['Magang', 'Freelance', 'Contract']), // Pilih status pekerjaan secara acak
            'dealer_name' => 'PT. ALFA SCORPII - AR. HAKIM',
            'dealer_id' => '9bec13cb-6237-4baf-a91f-30ee1e3830f4',
            'dealer_neq_name' => fake()->optional()->randomElement(['NEQ AR HAKIM', null]), // Opsional dengan nilai atau tidak sama sekali
            'dealer_neq_id' => fake()->optional()->randomElement(['cd610a94-1b8d-4cca-ab82-d1abc74bdb0d', null]), // Opsional dengan nilai atau tidak sama sekali
            'nip' => fake()->numerify('################'), // Opsional dengan NIP yang dihasilkan secara acak
            'bank_account_number' => fake()->optional()->numerify('################'), // Opsional dengan nomor rekening bank yang dihasilkan secara acak
            'bank_name' => fake()->optional()->company(), // Opsional dengan nama bank yang dihasilkan secara acak
            'branch_of_bank' => fake()->optional()->city(), // Opsional dengan cabang bank yang dihasilkan secara acak
        ];
    }
}
