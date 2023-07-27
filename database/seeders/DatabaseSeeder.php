<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->truncate();

        // add a default user
        DB::table('users')->insert([
            'name' => 'John Doe',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Using Faker library to generate random data
        $faker = Faker::create();

        // Generate 50 users
        for ($i = 0; $i < 50; $i++) {
            $name = $i.'-'.$faker->name;
            $email = $faker->unique()->safeEmail;
            $password = Hash::make('password'); // Set a default password for all users
            $created_at = now();
            $updated_at = now();

            $userId = DB::table('users')->insertGetId([
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'created_at' => $created_at,
                'updated_at' => $updated_at,
            ]);

            // Create friend requests for each user
            $this->createFriendRequests($userId);
        }
    }

    private function createFriendRequests($userId)
    {
        // Get a list of user IDs excluding the current user
        $userIds = DB::table('users')->where('id', '!=', $userId)->pluck('id');

        // Shuffle the user IDs to create random connections
        $randomUserIds = $userIds->shuffle();

        // Choose a random number of connections (between 10 to 20) for each user
        $numConnections = rand(10, 20);

        // Insert friend requests for the current user
        for ($i = 0; $i < $numConnections && $i < count($randomUserIds); $i++) {
            $requestFromId = $userId;
            $requestToId = $randomUserIds[$i];

            // Check if the friend request already exists in either direction
            $existingRequest = DB::table('friend_requests')
                ->where(function ($query) use ($requestFromId, $requestToId) {
                    $query->where('request_from_id', $requestFromId)
                        ->where('request_to_id', $requestToId);
                })
                ->orWhere(function ($query) use ($requestFromId, $requestToId) {
                    $query->where('request_from_id', $requestToId)
                        ->where('request_to_id', $requestFromId);
                })
                ->first();

            // If no friend request exists, create friend requests
            if (!$existingRequest) {
                // Generate a random number to determine the status (0 or 1)
                $status = rand(0, 1) ? '1' : '0'; // 50% chance of being connected (status = 1)
                $created_at = now();
                $updated_at = now();

                // Insert the friend request from user A to user B
                DB::table('friend_requests')->insert([
                    'request_from_id' => $requestFromId,
                    'request_to_id' => $requestToId,
                    'status' => $status,
                    'created_at' => $created_at,
                    'updated_at' => $updated_at,
                ]);

                // Insert the friend request from user B to user A
                DB::table('friend_requests')->insert([
                    'request_from_id' => $requestToId,
                    'request_to_id' => $requestFromId,
                    'status' => $status,
                    'created_at' => $created_at,
                    'updated_at' => $updated_at,
                ]);
            }
        }
    }
}
