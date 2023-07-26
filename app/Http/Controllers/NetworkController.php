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

        $getSentRequest = FriendRequest::where('request_from_id', $user_id)->pluck('request_to_id');
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
            ->take($limit)
            ->get();
        } else {
            $users = DB::table('friend_requests as fr')
            ->leftJoin('users as u', 'fr.request_from_id', '=', 'u.id')
            ->where([
                ['fr.request_to_id', '=', $user_id],
                ['fr.status', '=', 0],
            ])
            ->select('fr.*', 'u.name', 'u.email')
            ->take($limit)
            ->get();
        }

        return response()->json( array('success' => true, 'user_id' => $user_id, 'users'=> $users) );
    }

    public function getConnections($limit = 10)
    {
        $user_id = Auth::id();

        $connectedUsers = DB::select("
            SELECT u.id AS user_id, u.name AS user_name, u.email AS user_email COUNT(DISTINCT fr1.request_to_id) as mutual_connections
            FROM users u
            INNER JOIN friend_requests fr ON (u.id = fr.request_from_id AND fr.status = '1' AND fr.request_to_id = :userId)
            LEFT JOIN friend_requests fr1 ON (u.id = fr1.request_from_id AND fr1.status = '1')
            WHERE u.id != :userId
            GROUP BY u.id
        ", ['userId' => $user_id]);
// dd($connectedUsers);
        return response()->json( array('success' => true, 'user_id' => $user_id, 'users'=> $connectedUsers) );
    }

    public function deleteRequests($connection_id)
    {
        FriendRequest::find($connection_id)->delete();

        return response()->json( array('success' => true));
    }
}
