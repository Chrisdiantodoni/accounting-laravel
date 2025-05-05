<?php

use App\Console\Commands\GenerateNewYear;
use App\Console\Commands\GenerateYearlyProfitAndLossReport;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('generate:yearly-pl-report', function () {
    $this->call(GenerateYearlyProfitAndLossReport::class);
})->describe('Generate yearly profit and loss report')->yearlyOn(12, 31, '23:59');

Artisan::command('generate:new-year', function () {
    $this->call(GenerateNewYear::class);
})
    ->yearly()
    ->at('00:01');
