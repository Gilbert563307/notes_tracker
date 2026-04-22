package com.notes_tracker.backend.application;


import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.notes_tracker.backend.security.application.UserService;
import org.junit.jupiter.api.BeforeEach;
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
    private final TaskRepository repo =mock(TaskRepository.class);
    private final UserService userService = mock(UserService.class);
    private final  TaskService service = new TaskService(this.repo, this.userService);

    @BeforeEach
    void init(){
        when(userService.getUserIdByAuthentication()).thenReturn("user-1");
    }

    @Test
    void createTask() {
        
        Task task = new Task.Builder()
                .title("Test")
                // .kanBoardId("1")
                .userId("user-1")
                .build();

        when(repo.save(any(Task.class))).thenReturn(task);

        TaskDto result = service.createTask(TaskDto.from(task));

        verify(repo).save(any(Task.class));
        assertNotNull(result);
        assertEquals("Test", result.title());
    }

    @Test
    void getTask() {

        Task task = new Task.Builder()
                .title("Test")
                // .kanBoardId("1")
                .userId("user-1")
                .build();

        when(repo.findById("1")).thenReturn(Optional.of(task));

        TaskDto result = service.getTask("1");

        verify(repo).findById("1");
        assertEquals("Test", result.title());
    }

    @Test
    void updateTask() {
        Task task = new Task.Builder()
                .title("Old3")
                // .kanBoardId("1")
                .userId("user-1")
                .build();

        when(repo.findById("1")).thenReturn(Optional.of(task));
        when(repo.save(any())).thenAnswer(i -> i.getArgument(0));

        TaskDto updated = service.updateTask(
                new TaskDto(
                        "1",
                        "neww",
                        "desc",
                        Task.TaskStatus.DOING,
                        2,
                        "user",
                        false,
                        null,
                        null
                )
        );

        assertEquals("neww", updated.title());
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
