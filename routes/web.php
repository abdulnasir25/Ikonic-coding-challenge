<?php

use App\Http\Controllers\NetworkController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::get('/users/{skipCounter}/{takeAmount}', [NetworkController::class, 'loadSuggestions']);
Route::post('/users/send-request/{id}', [NetworkController::class, 'sendRequest']);
Route::get('/users/get-requests/{mode}', [NetworkController::class, 'getRequests']);
Route::delete('/users/delete/{id}', [NetworkController::class, 'deleteRequests']);
Route::post('/users/accept-request/{id}', [NetworkController::class, 'acceptRequest']);
Route::get('/users/connections', [NetworkController::class, 'getConnections']);

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
