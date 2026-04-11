package com.notes_tracker.backend.security.presentation.response;

import com.notes_tracker.backend.security.application.dto.UserDto;

public record AuthResponse(
        String token,
        long expiresIn,
        UserDto user
) {
}

