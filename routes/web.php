<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ClosingController;
use App\Http\Controllers\CoaGroupController;
use App\Http\Controllers\EntryController;
use App\Http\Controllers\LedgerController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ParentAccountController;
use App\Http\Controllers\ProfitLossStatementController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\YearController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/list-users', [UserController::class, 'index'])->name('list.users');
    Route::get('/list-users/{id}', [UserController::class, 'show'])->name('show.user');
    Route::put('/edit-user/{id}', [UserController::class, 'editUser'])->name('edit.user');
    Route::put('/change-year', [YearController::class, 'changeYear'])->name('change.year');
    Route::put('/change-location', [UserController::class, 'changeLocation'])->name('change.location');
    Route::post('/add-users', [UserController::class, 'storeUser'])->name('store.users');
    Route::put('/change-password', [UserController::class, 'changePassword'])->name('change.password');

    Route::prefix('list')->group(function () {
        Route::post('/entry/store', [EntryController::class, 'store'])->name('store.entries');
        Route::post('/entry/{id}/update', [EntryController::class, 'update'])->name('update.entries');
        Route::post('/entry/{id}/update/posting', [EntryController::class, 'updateToPosting'])->name('update.entries.posting');
        Route::post('/entry/{id}/update/un-posting', [EntryController::class, 'unpostingEntry'])->name('update.entries.unposting');
        Route::delete('/entry/delete/{id}', [EntryController::class, 'deleteEntry'])->name('delete.entries');

        Route::get('/entry/add', [EntryController::class, 'addEntry'])->name('add.entries');
        Route::get('/entry', [EntryController::class, 'entryList'])->name('list.entries');
        Route::get('/entry/{id}/edit', [EntryController::class, 'editEntry'])->name('edit.entries');
        Route::get('/entry/{id}', [EntryController::class, 'showEntry'])->name('show.entries');

        Route::get('/postings', [EntryController::class, 'postingList'])->name('list.postings');
        Route::get('/postings/{id}', [EntryController::class, 'showPosting'])->name('show.postings');

        Route::get('/close-book', [ClosingController::class, 'closingBookList'])->name('list.close.book');
    });

    Route::prefix('reports')->group(function () {
        Route::get('/profit-loss', [ReportController::class, 'profitLossReports'])->name('reports.profit.loss');
        Route::get('/balance-sheet', [ReportController::class, 'balanceSheetReports'])->name('reports.balance.sheet');
        Route::get('/historical-journal', [ReportController::class, 'historicalJournalReports'])->name('reports.historical.journal');

        Route::post('/closing', [ClosingController::class, 'closeBook'])->name('close.book');
        Route::post('/open', [ClosingController::class, 'openBook'])->name('open.book');
    });

    Route::prefix('close-book')->group(function () {
        Route::get('/location', [ClosingController::class, 'getLocationClosing'])->name('list.location.close.book');
        Route::post('/closing', [ClosingController::class, 'closeBook'])->name('close.book');
        Route::post('/open', [ClosingController::class, 'openBook'])->name('open.book');
    });

    Route::prefix('master')->group(function () {
        Route::get('/list-locations', [LocationController::class, 'index'])->name('list.locations');
        Route::post('/add-locations', [LocationController::class, 'store'])->name('store.locations');
        Route::put('/update-locations/{id}', [LocationController::class, 'update'])->name('update.locations');

        Route::get('/accounts', [AccountController::class, 'index'])->name('list.accounts');
        Route::get('/coa', [CoaGroupController::class, 'index'])->name('list.coa');
        Route::get('/ledgers', [LedgerController::class, 'index'])->name('list.ledgers');
        Route::get('/list-profit-loss/statements/form', [ProfitLossStatementController::class, 'add'])->name('add.profitloss.statements');
        Route::post('/list-profit-loss/statements/store', [ProfitLossStatementController::class, 'store'])->name('store.profitloss.statements');
        Route::put('/list-profit-loss/statements/update/{id}', [ProfitLossStatementController::class, 'update'])->name('update.profitloss.statements');
        Route::get('/list-profit-loss/statements/{id}', [ProfitLossStatementController::class, 'show'])->name('show.profitloss.statements');
        Route::delete('/list-profit-loss/statements/delete/{id}', [ProfitLossStatementController::class, 'delete'])->name('delete.profitloss.statements');
        Route::get('/list-profit-loss/statements', [ProfitLossStatementController::class, 'index'])->name('list.profitloss.statements');

        Route::post('/coa', [CoaGroupController::class, 'storeCoa'])->name('store.coa');
        Route::delete('/parent/{id}', [AccountController::class, 'deleteParents'])->name('delete.parent.accounts');
        Route::delete('/child/{id}', [AccountController::class, 'deleteChilds'])->name('delete.child.accounts');
        Route::delete('/coa/{id}', [CoaGroupController::class, 'deleteCoaGroup'])->name('delete.coa');
        Route::post('/accounts/parent', [AccountController::class, 'storeParentAccount'])->name('store.parent.accounts');
        Route::post('/accounts/child', [AccountController::class, 'storeChildAccount'])->name('store.child.accounts');
        Route::post('/ledgers', [LedgerController::class, 'storeLedger'])->name('store.ledgers');
        Route::put('/ledgers/{id}', [LedgerController::class, 'updateLedger'])->name('update.ledgers');
        Route::delete('/ledgers/{id}', [LedgerController::class, 'deleteLedgers'])->name('delete.ledgers');
    });

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('user.logout');
});

require __DIR__ . '/auth.php';
