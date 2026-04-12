package com.notes_tracker.backend.application;


import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.notes_tracker.backend.kanboard.application.TaskService;
import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.Task;

public class TaskServiceTests {

    @Test
    void createTask() {
        TaskRepository repo = mock(TaskRepository.class);
        TaskService service = new TaskService(repo);

        Task task = new Task.Builder()
                .title("Test")
                // .kanBoardId("1")
                .build();

        when(repo.save(any(Task.class))).thenReturn(task);

        TaskDto result = service.createTask(TaskDto.from(task));

        verify(repo).save(any(Task.class));
        assertNotNull(result);
        assertEquals("Test", result.title());
    }

    @Test
    void getTask() {
        TaskRepository repo = mock(TaskRepository.class);
        TaskService service = new TaskService(repo);

        Task task = new Task.Builder()
                .title("Test")
                // .kanBoardId("1")
                .build();

        when(repo.findById("1")).thenReturn(Optional.of(task));

        TaskDto result = service.getTask("1");

        verify(repo).findById("1");
        assertEquals("Test", result.title());
    }

    @Test
    void updateTask() {
        TaskRepository repo = mock(TaskRepository.class);
        TaskService service = new TaskService(repo);

        Task task = new Task.Builder()
                .title("Old")
                // .kanBoardId("1")
                .build();

        when(repo.findById("1")).thenReturn(Optional.of(task));
        when(repo.save(any())).thenAnswer(i -> i.getArgument(0));

        TaskDto updated = service.updateTask(
                new TaskDto(
                        "1",
                        "2",
                        "New",
                        "desc",
                        Task.TaskStatus.DOING,
                        2,
                        "user",
                        false,
                        null,
                        null
                )
        );

        assertEquals("New", updated.title());
        assertEquals("desc", updated.description());
        assertEquals(Task.TaskStatus.DOING, updated.status());
        assertEquals(2, updated.priority());
        assertEquals("user", updated.assigneId());
        assertFalse(updated.archived());
    }

    @Test
    void getTasks() {
        //TODO write test
    }
}
