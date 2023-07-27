<?php

namespace App\Http\Controllers;

use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NetworkController extends Controller
{
    public function loadSuggestions($skipCounter, $takeAmount)
    {
        $user_id = Auth::id();

        $getSentRequest = FriendRequest::where([
            ['request_from_id', $user_id],
            ['status', '=', 0]
        ])->pluck('request_to_id');
        $getReceivedRequest = FriendRequest::where([
            ['request_to_id', '=', $user_id],
            ['status', '=', 0]
        ])->pluck('request_from_id');
        $getConnections = FriendRequest::where([
            ['request_to_id', '=', $user_id],
            ['status', '=', 1]
        ])->pluck('request_from_id');

        $users = DB::table('users as u')
        ->where('u.id', '!=', $user_id)
        ->whereNotIn('id', $getSentRequest->toArray())
        ->whereNotIn('id', $getConnections->toArray())
        ->select('u.*')
        ->skip($skipCounter)
        ->take($takeAmount)
        ->get();

        return response()->json( array('success' => true, 'suggestions_count' => count($users), 'sent_request_count' => count($getSentRequest), 'received_request_count' => count($getReceivedRequest), 'connections_count' => count($getConnections), 'user_id' => $user_id, 'users'=> $users) );
    }

    public function sendRequest($id)
    {
        $connection = FriendRequest::create([
            'request_from_id' => Auth::id(),
            'request_to_id' => $id,
            'status' => 0
        ]);

        return response()->json( array('success' => true, 'connection'=> $connection) );
    }

    public function acceptRequest($id)
    {
        $connection = FriendRequest::where('id', $id)->update([
            'status' => 1
        ]);

        return response()->json( array('success' => true, 'connection'=> $connection) );
    }

    public function getRequests($mode, $limit = 10)
    {
        $user_id = Auth::id();
        if ($mode == 'sent') {
            $users = DB::table('friend_requests as fr')
            ->leftJoin('users as u', 'u.id', '=', 'fr.request_to_id')
            ->where([
                ['fr.request_from_id', '=', $user_id],
                ['fr.status', '=', 0],
            ])
            ->select('fr.*', 'u.name', 'u.email')
            // ->take($limit)
            ->get();
        } else {
            $users = DB::table('friend_requests as fr')
            ->leftJoin('users as u', 'fr.request_from_id', '=', 'u.id')
            ->where([
                ['fr.request_to_id', '=', $user_id],
                ['fr.status', '=', 0],
            ])
            ->select('fr.*', 'u.name', 'u.email')
            // ->take($limit)
            ->get();
        }

        return response()->json( array('success' => true, 'user_id' => $user_id, 'users'=> $users) );
    }

    public function getConnections($skipCounter, $takeAmount)
    {
        $user_id = Auth::id();

        $connectedUsers = User::select('users.id', 'users.name', 'users.email', 'users.password', 'users.created_at')
            ->join('friend_requests as fr', function ($join) use ($user_id) {
                $join->on('users.id', '=', 'fr.request_from_id')
                    ->where('fr.status', '1')
                    ->where('fr.request_to_id', '=', $user_id);
            })
            ->leftJoin('friend_requests as fr1', function ($join) {
                $join->on('users.id', '=', 'fr1.request_from_id')
                    ->where('fr1.status', '1');
            })
            ->where('users.id', '!=', $user_id)
            ->groupBy('users.id', 'users.name', 'users.email', 'users.password', 'users.created_at')
            ->selectRaw('COUNT(DISTINCT fr1.request_to_id) as common_connections_count')
            // ->skip($skipCounter)
            // ->take($takeAmount)
            ->get();

        return response()->json( array('success' => true, 'user_id' => $user_id, 'users'=> $connectedUsers) );
    }

    public function deleteRequests($mode, $connection_id)
    {
        if ($mode == "connection") {
            FriendRequest::where([
                ['request_from_id', '=', Auth::id()],
                ['request_to_id', '=', $connection_id],
                ['status', '=', 1],
            ])
            ->orWhere([
                ['request_from_id', '=', $connection_id],
                ['request_to_id', '=', Auth::id()],
                ['status', '=', 1],
            ])
            ->delete();
        } else {
            FriendRequest::find($connection_id)->delete();
        }

        return response()->json( array('success' => true, 'mode' => $mode));
    }
}
