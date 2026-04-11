package com.notes_tracker.backend.security.presentation.request;

public record AuthenticationRequest(String email, String password) {
}
