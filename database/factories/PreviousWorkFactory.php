<?php

namespace Database\Factories;

use App\Models\OtherInformation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PreviousWork>
 */
class PreviousWorkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_name' => $this->faker->company(),
            'position' => $this->faker->jobTitle(),
            'work_period' => $this->faker->date('Y-m-d'), // Periode kerja
            'other_information_id' => OtherInformation::factory()
        ];
    }
}
