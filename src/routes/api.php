<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReminderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Enums\TokenAbility;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    Route::resource('/reminder', ReminderController::class);
});

Route::post('/refresh-token', [AuthController::class, 'refreshToken'])->middleware([
    'auth:sanctum',
    'ability:'.TokenAbility::ISSUE_ACCESS_TOKEN->value,
]);