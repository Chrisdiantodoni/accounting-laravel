<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OtherInformation>
 */
class OtherInformationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sim_type' => fake()->randomElement(['SIM A', 'SIM B', 'SIM C', 'SIM D']), // Tipe SIM secara acak
            'health_history' => fake()->sentence(), // Riwayat kesehatan
            'hobbies' => fake()->sentence(), // Hobi
            'linkedin' => fake()->optional()->url(), // URL profil LinkedIn, opsional
            'twitter' => fake()->optional()->userName(), // Nama pengguna Twitter, opsional
            'facebook' => fake()->optional()->userName(), // Nama pengguna Facebook, opsional
            'instagram' => fake()->optional()->userName(), // Nama pengguna Instagram, opsional
            'foreign_language' => fake()->randomElement(['English', 'French', 'Spanish', 'German', 'Japanese', 'Chinese']), // Bahasa asing yang dikuasai
        ];
    }
}
