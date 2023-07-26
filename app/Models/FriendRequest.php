<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FriendRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_from_id',
        'request_to_id',
        'status'
    ];

    public function friends()
    {
        return $this->belongsToMany(User::class, 'friend_requests', 'request_from_id', 'request_to_id')
            ->where('status', '1');
    }

    public function mutualFriends(User $otherUser)
    {
        return $this->friends()->whereHas('friend_requests', function ($query) use ($otherUser) {
            $query->where('request_to_id', $otherUser->id);
        })->get();
    }

}
