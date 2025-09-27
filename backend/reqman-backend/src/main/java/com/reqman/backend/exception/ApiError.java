package com.reqman.backend.exception;

import org.springframework.http.HttpStatus;

import java.time.Instant;

public record ApiError(Instant timestamp, int status, String error, String message, String path) {

    public static ApiError fromStatus(HttpStatus status, String message, String path) {
        return new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), message, path);
    }
}

