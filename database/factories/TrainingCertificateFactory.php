<?php

namespace Database\Factories;

use App\Models\OtherInformation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrainingCertificate>
 */
class TrainingCertificateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(), // Nama sertifikasi
            'period' => fake()->date(), // Periode sertifikasi
            'other_information_id' => OtherInformation::factory(),
        ];
    }
}
