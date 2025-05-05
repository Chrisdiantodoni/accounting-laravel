<?php

namespace Database\Factories;

use App\Models\ContactInformation;
use App\Models\EducationalInformation;
use App\Models\EmergencyContactInformation;
use App\Models\JobInformation;
use App\Models\PersonalInformation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'personal_information_id' => PersonalInformation::factory(),
            'contact_information_id' => ContactInformation::factory(),
            'emergency_contact_information_id' => EmergencyContactInformation::factory(),
            'educational_information_id' => EducationalInformation::factory(),
            'job_information_id' => JobInformation::factory(),
            'employee_status' => 'active'
        ];
    }
}
