package com.notes_tracker.backend.application;


import com.notes_tracker.backend.kanboard.application.KanBoardService;
import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
import com.notes_tracker.backend.security.application.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class KanBoardServiceTests {
    private final KanBoardRepository repo = mock(KanBoardRepository.class);
    private final UserService userService = mock(UserService.class);
    private final KanBoardService service = new KanBoardService(this.repo, userService);

    @Test
    void createBoard() {

        KanBoard board = new KanBoard.Builder()
                .name("Board")
                .userId("user")
                .build();

        when(this.repo.save(any())).thenReturn(board);

        KanBoardDto result = this.service.createBoard(KanBoardDto.from(board));

        assertEquals("Board", result.name());
    }

    @Test
    void updateBoard() {
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