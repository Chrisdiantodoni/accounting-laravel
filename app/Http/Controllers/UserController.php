<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\LocationByUser;
use App\Models\User;
use App\Models\Year;
use App\Models\YearByUser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q = $request->input('q');
        $query = User::query();
        $limit = $request->input('limit') ?? 10;
        $page = $request->input('page', 1);
        $status = $request->input('status');
        $location_id = $request->input('location_id');

        $query->when($q, function ($query) use ($q) {
            return $query->where('name', 'like', "%$q%")->orWhere("username", 'like', "%$q%");
        })->when($location_id, function ($query) use ($location_id) {
            return $query->whereHas('locations', function ($query) use ($location_id) {
                $query->where('location_id', $location_id['value']);
            });
        });

        if ($status !== null) {
            $query->where('status', $status);
        }

        $users = $query->paginate($limit, ['*'], 'page', $page);

        $filters = [
            'location_id' => $location_id,
            'status' => $status,
            'limit' => $limit,
            'q' => $q,
            'page' => $page,
        ];
        $locations = Location::all();
        $years = Year::all();


        return Inertia::render('Dashboard/User/ListUser', compact('users', 'filters', 'locations', 'years'));
    }

    public function show($user_id)
    {
        $user = User::findOrFail($user_id);
        $locations = Location::all();
        $years = Year::all();
        return Inertia::render('Dashboard/User/DetailUser', compact('user', 'locations', 'years'));
    }

    public function storeUser(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'username' => 'required|string',
                'locations' => 'required|array'
            ]);
            DB::beginTransaction();
            if ($validator->fails()) {
                $notification = array(
                    'type' => 'error',
                    'message' => 'Validation Error'
                );
                return redirect()->back()->withErrors($validator)->with('message',  $notification);
            }
            $user = User::create([
                'name' => $request->input('name'),
                'username' => strtolower($request->input('username')),
                'password' => Hash::make('password'),
                'password_reset_at' => Carbon::now(),
                'status' => 1
            ]);

            $years = $request->input('years');
            foreach ($years as $i => $year) {
                $yearValue = $year['value'];

                YearByUser::create([
                    'user_id' => $user->user_id,
                    'year_id' => $yearValue['id'],
                    'isSelected' => $i === 0,
                ]);
            }

            $locations = $request->input('locations');
            foreach ($locations as $i => $location) {
                $locationValue = $location['value'];

                LocationByUser::create([
                    'user_id' => $user->user_id,
                    'location_id' => $locationValue['id'],
                    'isSelected' => $i === 0,
                ]);
            }
            $notification = array(
                'type' => 'success',
                'message' => 'User Added Successfully'
            );
            DB::commit();

            return redirect()->back()->with('message',  $notification);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' => 'Failed to create User: ' . $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }


    public function changePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'old_password' => 'required',
                'password' => 'required|string|min:8|confirmed'
            ]);
            if ($validator->fails()) {
                $notification = array(
                    'type' => 'error',
                    'message' => "Failed Change password"
                );
                return redirect()->back()->withErrors($validator)->with('message',  $notification);
            }
            $user = Auth::user();
            $getUser = User::findOrFail($user->user_id);
            if (!$getUser) {
                $notification = array(
                    'type' => 'error',
                    'message' => 'User not found'
                );
                return redirect()->back()->with('message',  $notification);
            }
            if (!Hash::check($request->old_password, $getUser->password)) {
                $notification = array(
                    'type' => 'error',
                    'message' => 'Old Password is incorrect'
                );
                return redirect()->back()->with('message',  $notification);
            }
            $getUser->update([
                'password' => Hash::make($request->password),
                'password_reset_at' => null,
            ]);

            $notification = array(
                'type' => 'success',
                'message' => 'Password Changed Succesfully'
            );
            return redirect()->back()->with('message',  $notification);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }

    public function editUser(Request $request, $id)
    {
        try {
            $user = User::find($id);
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'username' => 'required|string',
                'locations' => 'required|array',
            ]);
            if ($validator->fails()) {
                $notification = array(
                    'type' => 'error',
                    'message' => 'User update Failed'
                );
                return redirect()->back()->withErrors($validator)->with('message', $notification);
            }
            DB::beginTransaction();
            $user->update([
                'name' => $request->input('name'),
                'username' => $request->input('username'),
            ]);
            YearByUser::where('user_id', $id)->delete();
            $years = $request->input('years');
            foreach ($years as $i => $year) {
                $yearValue = $year['value'];

                YearByUser::create([
                    'user_id' => $id,
                    'year_id' => $yearValue['id'],
                    'isSelected' => $i == 0,
                ]);
            }

            LocationByUser::where('user_id', $id)->delete();
            $locations = $request->input('locations');
            foreach ($locations as $i => $location) {
                $locationValue = $location['value'];

                LocationByUser::create([
                    'user_id' => $id,
                    'location_id' => $locationValue['id'],
                    'isSelected' => $i == 0,
                ]);
            }

            DB::commit();

            $notification = array(
                'type' => 'success',
                'message' => 'User updated successfully'
            );
            return redirect()->intended(route('list.users'))->with('message', $notification);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' => 'Failed to Edit User: ' . $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }

    public function changeLocation(Request $request)
    {
        $user = Auth::user();
        DB::beginTransaction();
        try {
            LocationByUser::where('user_id', $user->user_id)->update([
                'isSelected' => false,
            ]);

            $location = $request->input('location');

            LocationByUser::where('location_id', $location['id']) // <- ini input array ya, bukan object
                ->where('user_id', $user->user_id)
                ->update([
                    'isSelected' => true,
                ]);

            $notification = array(
                'type' => 'status',
                'message' => 'ok',
            );
            DB::commit();
            return redirect()->intended(route('dashboard'))
                ->with([
                    'message' => $notification,
                    'user' => $user,
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }

    public function resetPassword($user_id)
    {
        try {
            $getUser = User::findOrFail($user_id);
            $getUser->update([
                'password_reset_at' => Carbon::now()
            ]);
            $notification = array(
                'type' => 'success',
                'message' => 'Password Resetted Succesfully'
            );
            return redirect()->back()->with('message',  $notification);
        } catch (\Exception $e) {
            DB::rollBack();
            $notification = array(
                'type' => 'error',
                'message' =>  $e->getMessage()
            );
            return redirect()->back()->with('message',  $notification);
        }
    }
}
