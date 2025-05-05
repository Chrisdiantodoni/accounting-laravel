<?php

namespace App\Console\Commands;

use App\Models\Year;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateNewYear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-new-year';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $currentYear = Carbon::now()->year;

        if (!Year::where('year', $currentYear)->exists()) {
            Year::create(['year' => $currentYear]);
            $this->info("Year $currentYear created successfully.");
        } else {
            $this->info("Year $currentYear already exists.");
        }
    }
}
