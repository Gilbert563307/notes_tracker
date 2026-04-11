package com.notes_tracker.backend.kanboard.presentation.exception;



public class DomainException extends RuntimeException {
    public DomainException(String message) {
        super(message);
    }
}
