package com.notes_tracker.backend.domain;

import com.notes_tracker.backend.kanboard.presentation.exception.DomainException;
import org.junit.jupiter.api.Test;

import com.notes_tracker.backend.kanboard.domain.Task;

import static com.notes_tracker.backend.kanboard.domain.Task.MIN_TITLE_LENGTH;
import static org.junit.jupiter.api.Assertions.*;

public class TaskDomainTests {

    @Test
    void shouldBuildValidTask() {
        Task task = new Task.Builder()
                .title("Test Task")
                .userId("user-1")
                .description("desc")
                .priority(1)
                .assigneId("user-1")
                .build();

        assertNotNull(task);
        assertEquals("Test Task", task.getTitle());
        assertEquals("user-1", task.getUserId());
        assertEquals("desc", task.getDescription());
        assertEquals(1, task.getPriority());
        assertEquals("user-1", task.getAssigneId());
        assertEquals(Task.TaskStatus.TODO, task.getStatus());
        assertNotNull(task.getCreatedAt());
        assertNotNull(task.getUpdatedAt());
    }

    @Test
    void shouldUpdateTask() {
        Task task = new Task.Builder()
                .title("Oldy")
                .userId("user-1")
                // .kanBoardId("1")
                .build();

        task.updateTask("Neww", "desc", Task.TaskStatus.DOING, 2, "user", false);
        assertEquals("Neww", task.getTitle());
        assertEquals(Task.TaskStatus.DOING, task.getStatus());
    }

    @Test
    void shouldArchiveTask() {
        Task task = new Task.Builder()
                .userId("user 1")
                .title("Test")
                // .kanBoardId("1")
                .build();

        task.archiveTask();
        assertTrue(task.isArchived());
    }

    @Test
    void shouldFailToBuildTaskWithNoUser(){
        DomainException exception =  assertThrows(DomainException.class, () -> {
            new Task.Builder()
                    .title("Test")
                    .build();
        });
        String expectedMessage = "The owner of this task cannot be null";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    void shouldFailToBuildTaskWithToShortTitle(){
        DomainException exception =  assertThrows(DomainException.class, () -> {
            new Task.Builder()
                    .title("1")
                    .userId("user 1")
                    .build();
        });
        String expectedMessage = "The task title must be at least " + MIN_TITLE_LENGTH + " characters long.";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    void shouldFailToBuildTaskWithNoStatus(){
        DomainException exception =  assertThrows(DomainException.class, () -> {
            new Task.Builder()
                    .title("Test")
                    .userId("user 1")
                    .status(null)
                    .build();
        });
        String expectedMessage = "Please select a valid task status.";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));
    }

}
