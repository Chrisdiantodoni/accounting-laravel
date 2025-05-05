<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GenerateYearlyProfitAndLossReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-yearly-profit-and-loss-report';

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
        // Menampilkan pesan untuk memastikan command dijalankan
        $this->info('The yearly profit and loss report command is running...');
    }
}
