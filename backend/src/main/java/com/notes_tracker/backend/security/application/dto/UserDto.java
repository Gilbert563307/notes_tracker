package com.notes_tracker.backend.security.application.dto;

import com.notes_tracker.backend.security.domain.User;

public record UserDto(
        String id,
        String displayName,
        String photoURL
) {

    public static  UserDto from(User user){
        return new UserDto(
                user.getId(),
                user.getDisplayName(),
                user.getPhotoURL()
        );
    }
}
