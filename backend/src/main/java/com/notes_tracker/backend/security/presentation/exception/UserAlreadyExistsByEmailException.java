package com.notes_tracker.backend.security.presentation.exception;

public class UserAlreadyExistsByEmailException extends RuntimeException {
    public UserAlreadyExistsByEmailException(String message) {
        super(message);
    }
}
