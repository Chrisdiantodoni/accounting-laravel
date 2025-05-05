<?php

// use App\Http\Controllers\CashierController;

use App\Http\Controllers\AccountController;
use App\Http\Controllers\EntryController;
use App\Http\Controllers\LedgerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware(['web'])->group(
    function () {
        Route::post('/document-number/duplicate/{id}/edit', [EntryController::class, 'CheckDocumentNumberEdit'])->name('check.duplicate.entries.edit');
        Route::post('/document-number/duplicate', [EntryController::class, 'CheckDocumentNumber'])->name('check.duplicate.entries');

        Route::prefix('master')->group(
            function () {
                Route::post('/duplicate/child', [AccountController::class, 'checkDuplicateChildAccount'])->name('check.duplicate.child.account');
                Route::get('/ledgers', [LedgerController::class, 'getLedger'])->name('list.master.ledgers');
            }

        );
    }
);
// Route::get('/get-new-balance/{dealer_code}', [CashierController::class, 'syncStartBalance'])->name('get.new.balance');
