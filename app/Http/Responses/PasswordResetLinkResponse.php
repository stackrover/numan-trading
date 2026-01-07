<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\SuccessfulPasswordResetLinkRequestResponse;
use Laravel\Fortify\Contracts\FailedPasswordResetLinkRequestResponse;

class PasswordResetLinkResponse implements SuccessfulPasswordResetLinkRequestResponse, FailedPasswordResetLinkRequestResponse
{
    protected $status;

    public function __construct($status = null)
    {
        $this->status = $status;
    }

    public function toResponse($request)
    {
        $message = $this->status === 'passwords.sent'
            ? 'Password reset link sent to your email'
            : __($this->status);

        return response()->json(['message' => $message], $this->status === 'passwords.sent' ? 200 : 422);
    }
}
