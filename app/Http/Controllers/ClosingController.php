<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\Closing;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClosingController extends Controller
{
    public function closingBookList(Request $request)
    {
        $q = $request->input('q');
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $closings = Closing::latest()
            ->when($q, function ($query) use ($q) {
                $query->where('parent_account_name', 'like', '%' . $q . '%');
            })
            ->paginate($limit);

        $filters = [
            'limit' => $limit,
            'q' => $q,
            'page' => $page,
        ];
        return Inertia::render('Dashboard/Main/ListCloseBook', compact('closings', 'filters'));
    }

    public function getLocationClosing(Request $request)
    {

        $location = Location::latest()->with(['closing_books']);
        return ResponseFormatter::success($location,);
    }

    public function closeBook(Request $request) {}

    public function openBook(Request $request) {}
}
