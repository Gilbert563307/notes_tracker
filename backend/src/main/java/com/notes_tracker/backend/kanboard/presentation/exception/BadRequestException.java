package com.notes_tracker.backend.kanboard.presentation.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
