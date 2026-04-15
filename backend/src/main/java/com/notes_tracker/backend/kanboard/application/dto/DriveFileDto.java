package com.notes_tracker.backend.kanboard.application.dto;

import com.notes_tracker.backend.kanboard.domain.DriveFile;

import java.time.LocalDateTime;

public record DriveFileDto(
        String id,
        String name,
//        String folderId,
        String userId,
        String size,
        String type,
        boolean archived,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static DriveFileDto from(DriveFile file) {
        return new DriveFileDto(
                file.getId(),
                file.getName(),
//                file.getFolderId(),
                file.getUserId(),
                file.getSize(),
                file.getType(),
                file.isArchived(),
                file.getCreatedAt(),
                file.getUpdatedAt()
        );
    }

}