package com.notes_tracker.backend.kanboard.application.dto;

import com.notes_tracker.backend.kanboard.domain.KanBoard;

import java.time.LocalDateTime;

public record KanBoardDto(
        String id,
        String name,
        String userId,
        String color,
        boolean archived,
        boolean collaborative,
        String imageUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static KanBoardDto from(KanBoard board) {
        return new KanBoardDto(
                board.getId(),
                board.getName(),
                board.getUserId(),
                board.getColor(),
                board.isArchived(),
                board.isCollaborative(),
                board.getImageUrl(),
                board.getCreatedAt(),
                board.getUpdatedAt()
        );
    }

}