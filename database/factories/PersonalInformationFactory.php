<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PersonalInformation>
 */
class PersonalInformationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'place_of_birth' => fake()->city(),
            'date_of_birth' => Carbon::parse(fake()->dateTimeBetween('-60 years', '-20 years'))->format('Y-m-d'),
            'gender' => fake()->randomElement(['man', 'woman']),
            'id_card_address' => fake()->address(),
            'domicile_address' => fake()->address(),
            'nik' => fake()->unique()->numerify('################'), // assuming a 16-digit ID card number
            'npwp' => fake()->unique()->numerify('##.###.###.#-###.###'), // assuming a formatted NPWP number
            'bpjs_health_number' => fake()->unique()->numerify('################'), // assuming a 16-digit number
            'bpjs_employment_number' => fake()->unique()->numerify('################'), // assuming a 16-digit number
            'marital_status' => fake()->randomElement(['Menikah', 'Belum Menikah']),
            'partners_name' => fake()->optional()->name(), // partner's name, null if single
            'dependents_number' => fake()->numberBetween(0, 5),
            'blood_type' => fake()->randomElement(['A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+']),
        ];
    }
}
