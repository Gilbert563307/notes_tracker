package com.notes_tracker.backend.domain;


import com.notes_tracker.backend.kanboard.domain.KanBoard;
import com.notes_tracker.backend.kanboard.domain.Task;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class KanBoardDomainTests {
    private final Task task = new Task.Builder()
            .title("testing")
                .userId("user-1")
                .description("desc")
                .priority(1)
                .assigneId("user-1")
                .build();

    @Test
    void shouldBuildValidBoard() {
        KanBoard board = new KanBoard.Builder()
                .name("Board")
                .userId("user-1")
                .color("#33333")
                .archived(true)
                .collaborative(true)
                .imageUrl("img.png")
                .tasks(List.of(this.task))
                .build();

        assertNotNull(board);
        assertEquals("Board", board.getName());
        assertEquals("user-1", board.getUserId());
        assertEquals("#33333", board.getColor());
        assertTrue(board.isArchived());
        assertEquals("img.png", board.getImageUrl());
        assertTrue(board.isCollaborative());
        assertEquals(1, board.getTasks().size());
        assertNotNull(board.getCreatedAt());
        assertNotNull(board.getUpdatedAt());
    }

    @Test
    void shouldUpdateBoard() {
        KanBoard board = new KanBoard.Builder()
                .name("Board")
                .userId("user-1")
                .color("#33333")
                .archived(false)
                .collaborative(true)
                .imageUrl("img.png")
                .build();

        board.update("New", "user2", "#55555", true, false, "img2.png");

        assertEquals("New", board.getName());
        assertEquals("user2", board.getUserId());
        assertEquals("#55555", board.getColor());
        assertTrue(board.isArchived());
        assertFalse(board.isCollaborative());
        assertEquals("img2.png", board.getImageUrl());
        assertTrue(board.isArchived());
    }

    @Test
    void shouldAssignTask(){
        KanBoard board = new KanBoard.Builder()
                .name("Board")
                .userId("user-1")
                .color("#33333")
                .archived(false)
                .collaborative(true)
                .imageUrl("img.png")
                .build();

        board.assignTask(this.task);
        assertEquals(1, board.getTasks().size());
    }

}
