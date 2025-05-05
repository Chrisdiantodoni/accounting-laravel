<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmergencyContactInformation>
 */
class EmergencyContactInformationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'relation' => $this->faker->randomElement(['Saudara Kandung', 'Kakak', 'Ayah']),
            'tel_number' => $this->faker->phoneNumber(),
            'address' => $this->faker->address()
        ];
    }
}
