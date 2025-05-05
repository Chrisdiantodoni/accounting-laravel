<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->input('q');
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page');
        $locations = Location::latest()
            ->when($q, function ($query) use ($q) {
                $query->where('location_name', 'like', '%' . $q . '%');
            })
            ->paginate($limit);

        $filters = [
            'limit' => $limit,
            'q' => $q,
            'page' => $page,
        ];
        return Inertia::render('Dashboard/Master/ListLocation', compact('locations',  'filters'));
    }

    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'location_name' => 'required|string|max:255',
            'location_code' => 'required|string|max:100|unique:locations,code',
            'address' => 'nullable|string|max:500',
        ]);
        if ($validator->fails()) {
            $notification = array(
                'type' => 'error',
                'message' => "Tambah lokasi gagal"
            );
            return redirect()->back()->withErrors($validator)->with('message',  $notification);
        }
        // Menangkap data input
        $location_name = $request->input('location_name');
        $location_code = $request->input('location_code');
        $address = $request->input('address');

        try {
            // Menyimpan data menggunakan create() di model Location
            Location::create([
                'location_name' => $location_name,
                'code' => $location_code,
                'address' => $address,
            ]);

            // Menyiapkan notifikasi sukses
            $notification = [
                'type' => 'success',
                'message' => 'Location added successfully!'
            ];
        } catch (\Exception $e) {

            $notification = [
                'type' => 'error',
                'message' => 'Add Location failed: ' . $e->getMessage()
            ];
        }
        return redirect()->back()->with('message', $notification);
    }
    public function update(Request $request, $id)
    {
        // Validasi input
        $request->validate([
            'location_name' => 'required|string|max:255',
            'location_code' => 'required|string|max:100|unique:locations,code',
            'address' => 'nullable|string|max:500',
        ]);

        // Menangkap data input
        $location_name = $request->input('location_name');
        $location_code = $request->input('location_code');
        $address = $request->input('address');

        try {
            $location = Location::find($id);
            // Menyimpan data menggunakan create() di model Location
            $location->update([
                'location_name' => $location_name,
                'code' => $location_code,
                'address' => $address,
            ]);

            // Menyiapkan notifikasi sukses
            $notification = [
                'type' => 'success',
                'message' => 'Location Edit successfully!'
            ];
        } catch (\Exception $e) {

            $notification = [
                'type' => 'error',
                'message' => 'Edit Location failed: ' . $e->getMessage()
            ];
        }
        return redirect()->back()->with('message', $notification);
    }
}
