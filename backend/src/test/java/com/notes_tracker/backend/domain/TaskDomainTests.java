package com.notes_tracker.backend.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import com.notes_tracker.backend.kanboard.domain.Task;

public class TaskDomainTests {

    @Test
    void shouldBuildValidTask() {
        Task task = new Task.Builder()
                .title("Test Task")
                // .kanBoardId("board-1")
                .description("desc")
                .priority(1)
                .assigneId("user-1")
                .build();

        assertNotNull(task);
        assertEquals("Test Task", task.getTitle());
        // assertEquals("board-1", task.getKanBoardId());
        assertEquals(Task.TaskStatus.TODO, task.getStatus());
        assertNotNull(task.getCreatedAt());
        assertNotNull(task.getUpdatedAt());
    }

    @Test
    void shouldUpdateTask() {
        Task task = new Task.Builder()
                .title("Old")
                // .kanBoardId("1")
                .build();

        task.updateTask("New", "desc", Task.TaskStatus.DOING, 2, "user", false);

        assertEquals("New", task.getTitle());
        assertEquals(Task.TaskStatus.DOING, task.getStatus());
    }

    @Test
    void shouldArchiveTask() {
        Task task = new Task.Builder()
                .title("Test")
                // .kanBoardId("1")
                .build();

        task.archiveTask();
        assertTrue(task.isArchived());
    }
}
