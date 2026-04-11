package com.notes_tracker.backend.security.presentation.request;

public record RegisterRequest(String displayName, String emailAddress, String password, String passwordConfirm) {
}
