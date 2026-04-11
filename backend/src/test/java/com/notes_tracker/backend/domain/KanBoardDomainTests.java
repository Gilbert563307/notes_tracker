package com.notes_tracker.backend.domain;


import com.notes_tracker.backend.kanboard.domain.KanBoard;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class KanBoardDomainTests {

    @Test
    void shouldBuildValidBoard() {
        KanBoard board = new KanBoard.Builder()
                .name("Board")
                .userId("user-1")
                .color("blue")
                .collaborative(true)
                .imageUrl("img.png")
                .build();

        assertNotNull(board);
        assertEquals("Board", board.getName());
        assertTrue(board.isCollaborative());
        assertNotNull(board.getCreatedAt());
    }

    @Test
    void shouldUpdateBoard() {
        KanBoard board = new KanBoard.Builder()
                .name("Old")
                .userId("user")
                .build();

        board.update("New", "user2", "red", true, false, "img2.png");

        assertEquals("New", board.getName());
        assertEquals("red", board.getColor());
        assertTrue(board.isArchived());
    }
}
