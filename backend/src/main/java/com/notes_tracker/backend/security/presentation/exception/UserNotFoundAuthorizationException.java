package com.notes_tracker.backend.security.presentation.exception;

public class UserNotFoundAuthorizationException extends RuntimeException {
    public UserNotFoundAuthorizationException(String message) {
        super(message);
    }
}
