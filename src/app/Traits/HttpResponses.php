<?php

namespace App\Traits;

trait HttpResponses {
    protected function Success($data, $message = null, $code = 200) {
        return response()->json([
            'status' => 'Success',
            'msg' => $message,
            'data' => $data,
        ], $code);
    }   
    protected function Error($err, $message = null, $code) {
        return response()->json([
            'ok' => false,
            'err' => $err,
            'msg' => $message,
        ], $code);
    }   
}
