<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EducationalInformation>
 */
class EducationalInformationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'last_education' => fake()->randomElement(['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'Ph.D.']),
            'institute_name' => fake()->company(), // Assuming the institute name is similar to a company name
            'major' => fake()->randomElement(['Computer Science', 'Business Administration', 'Psychology', 'Engineering', 'Medicine']),
            'year_graduate' => fake()->year(), // Generates a graduation year up to the current year
            'academic_title' => fake()->randomElement(['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.']),
        ];
    }
}
