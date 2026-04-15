package com.notes_tracker.backend.kanboard.application.dto;

import com.notes_tracker.backend.kanboard.domain.Folder;

import java.time.LocalDateTime;

public record FolderDto(
        String id,
        String name,
        String userId,
        String color,
        boolean archived,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static FolderDto from(Folder folder) {
        return new FolderDto(
                folder.getId(),
                folder.getName(),
                folder.getUserId(),
                folder.getColor(),
                folder.isArchived(),
                folder.getCreatedAt(),
                folder.getUpdatedAt()
        );
    }

}