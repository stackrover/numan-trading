<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\PasswordResetResponse as PasswordResetResponseContract;
use Laravel\Fortify\Contracts\FailedPasswordResetResponse;

class PasswordResetResponse implements PasswordResetResponseContract, FailedPasswordResetResponse
{
    protected $status;

    public function __construct($status = null)
    {
        $this->status = $status;
    }

    public function toResponse($request)
    {
        $message = $this->status === 'passwords.reset'
            ? 'Password reset successful'
            : __($this->status);

        return response()->json(['message' => $message], $this->status === 'passwords.reset' ? 200 : 422);
    }
}
