<?php

namespace App\Http\Controllers\Api;

use App\Enums\TokenAbility;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use App\Traits\HttpResponses;
use DateInterval;
use DateTime;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use HttpResponses;

    public function login(LoginUserRequest $request)
    {
        $request->validated($request->only(['email', 'password']));

        if(!Auth::attempt($request->only(['email', 'password']))) {
            return $this->error('', 'Credentials do not match', 401);
        }

        $user = User::where('email', $request->email)->first();
        // dd(config('sanctum.expiration'));
        $accessToken = $user->createToken('access_token', [TokenAbility::ACCESS_API->value], $this->calculateExpirationTime(config('sanctum.expiration')));
        $refreshToken = $user->createToken('refresh_token', [TokenAbility::ISSUE_ACCESS_TOKEN->value], $this->calculateExpirationTime(config('sanctum.rt_expiration')));

        return $this->success([
            'user' => $user,
            'access_token' => $accessToken->plainTextToken,
            'refresh_token' => $refreshToken->plainTextToken,
        ]);
    }

    public function register(StoreUserRequest $request)
    {
        $request->validated($request->only(['name', 'email', 'password']));

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return $this->success([
            'user' => $user,
            'token' => $user->createToken('access_token', ['*'], config('sanctum.expiration'))->plainTextToken
        ]);
    }

    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();

        return $this->success([
            'message' => 'You have succesfully been logged out and your token has been removed'
        ]);
    }

    public function refreshToken(Request $request)
    {
       
       $accessToken = $request->user()->createToken('access_token', [TokenAbility::ACCESS_API->value], config('sanctum.expiration'));

       return ['token' => $accessToken->plainTextToken];
    }

    function calculateExpirationTime($durationInMinutes) {
        // Create a DateTime object for the current time
        $currentDateTime = new DateTime();
    
        // Add the expiration duration in minutes
        $expirationDateTime = $currentDateTime->add(new DateInterval('PT' . $durationInMinutes . 'M'));
    
        return $expirationDateTime;
    }
}
