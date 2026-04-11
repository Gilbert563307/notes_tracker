package com.notes_tracker.backend.application;


import com.notes_tracker.backend.kanboard.application.KanBoardService;
import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class KanBoardServiceTests {

    @Test
    void createBoard() {
        KanBoardRepository repo = mock(KanBoardRepository.class);
        KanBoardService service = new KanBoardService(repo);

        KanBoard board = new KanBoard.Builder()
                .name("Board")
                .userId("user")
                .build();

        when(repo.save(any())).thenReturn(board);

        KanBoardDto result = service.createBoard(KanBoardDto.from(board));

        assertEquals("Board", result.name());
    }

    @Test
    void updateBoard() {
        KanBoardRepository repo = mock(KanBoardRepository.class);
        KanBoardService service = new KanBoardService(repo);

        KanBoard board = new KanBoard.Builder()
                .name("Old")
                .userId("user")
                .build();

        when(repo.findById("1")).thenReturn(Optional.of(board));
        when(repo.save(any())).thenAnswer(i -> i.getArgument(0));

        KanBoardDto updated = service.updateBoard(
                new KanBoardDto(
                        "1",
                        "Board",
                        "user-1",
                        "blue",
                        false,
                        true,
                        "img.png",
                        null,
                        null
                )
        );

        assertEquals("Board", updated.name());
        assertEquals("user-1", updated.userId());
        assertEquals("blue", updated.color());
        assertTrue(updated.collaborative());
        assertEquals("img.png", updated.imageUrl());
        assertFalse(updated.archived());
    }
}