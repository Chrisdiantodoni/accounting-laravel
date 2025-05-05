<?php

namespace App\Http\Controllers;

use App\Models\YearByUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class YearController extends Controller
{
    public function changeYear(Request $request)
    {
        $user = Auth::user();
        DB::beginTransaction();
        try {
            YearByUser::where('user_id', $user->user_id)->update([
                'isSelected' => false,
            ]);

            $year = $request->input('year');

            YearByUser::where('year_id', $year['id']) // <- ini input array ya, bukan object
                ->where('user_id', $user->user_id)
                ->update([
                    'isSelected' => true,
                ]);

            $notification = array(
                'type' => 'status',
                'message' => 'ok',
            );
            DB::commit();
            return redirect()->back()
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
}
