package com.notes_tracker.backend.security.presentation.exception;

public class PasswordDoestNotMatchException extends RuntimeException {
    public PasswordDoestNotMatchException(String message) {
        super(message);
    }
}
