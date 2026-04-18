package com.notes_tracker.backend.application.integration;


import com.notes_tracker.backend.kanboard.application.TaskService;
import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.Task;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class TaskServiceIntegrationTests {

    @Autowired
    TaskService taskService;

    @Autowired
    TaskRepository taskRepository;

    @AfterEach
    void cleanup() {
        taskRepository.deleteAll();
    }

    @Test
    void createTask() {
        TaskDto dto = new TaskDto(
                null,
                "Task A",
                "desc",
                Task.TaskStatus.TODO,
                1,
                "user-1",
                false,
                null,
                null
        );

        TaskDto result = taskService.createTask(dto);

        assertNotNull(result.id());

        assertEquals("Task A", result.title());
        assertEquals("desc", result.description());
        assertEquals(Task.TaskStatus.TODO, result.status());
        assertEquals(1, result.priority());
        assertEquals("user-1", result.assigneId());
        assertFalse(result.archived());

        assertNotNull(result.createdAt());
        assertNotNull(result.updatedAt());
    }

    @Test
    void createAndFetchTask() {
        TaskDto created = taskService.createTask(new TaskDto(
                null, "Task B", "desc",
                Task.TaskStatus.DOING, 2, "user-1", false, null, null
        ));

        TaskDto fetched = taskService.getTask(created.id());

        assertEquals(created.id(), fetched.id());

        assertEquals("Task B", fetched.title());
        assertEquals("desc", fetched.description());
        assertEquals(Task.TaskStatus.DOING, fetched.status());
        assertEquals(2, fetched.priority());
        assertEquals("user-1", fetched.assigneId());
        assertFalse(fetched.archived());

        assertNotNull(fetched.createdAt());
        assertNotNull(fetched.updatedAt());
    }

    @Test
    void updateTaskAndVerifyPersistence() {
        TaskDto created = taskService.createTask(new TaskDto(
                null, "board-1", "desc",
                Task.TaskStatus.TODO, 1, "user-1", false, null, null
        ));

        taskService.updateTask(new TaskDto(
                created.id(),
                "Updated",
                "new desc",
                Task.TaskStatus.DONE,
                5,
                "user-2",
                true,
                null,
                null
        ));

        TaskDto fetched = taskService.getTask(created.id());

        assertEquals("Updated", fetched.title());
        assertEquals("new desc", fetched.description());
        assertEquals(Task.TaskStatus.DONE, fetched.status());
        assertEquals(5, fetched.priority());
        assertEquals("user-2", fetched.assigneId());
        assertTrue(fetched.archived());

        assertNotNull(fetched.createdAt());
        assertNotNull(fetched.updatedAt());
    }

    @Test
    void getTaskById() {
        TaskDto created = taskService.createTask(new TaskDto(
                null,
                "Task A",
                "desc",
                Task.TaskStatus.TODO,
                1,
                "user-1",
                false,
                null,
                null
        ));

        TaskDto fetched = taskService.getTask(created.id());

        assertNotNull(fetched);

        assertEquals(created.id(), fetched.id());
        assertEquals("Task A", fetched.title());
        assertEquals("desc", fetched.description());
        assertEquals(Task.TaskStatus.TODO, fetched.status());
        assertEquals(1, fetched.priority());
        assertEquals("user-1", fetched.assigneId());
        assertFalse(fetched.archived());

        assertNotNull(fetched.createdAt());
        assertNotNull(fetched.updatedAt());
    }

    @Test
    void deleteTask() {
        TaskDto created = taskService.createTask(new TaskDto(
                null,
                "Task A",
                "desc",
                Task.TaskStatus.TODO,
                1,
                "user-1",
                false,
                null,
                null
        ));

        taskService.deleteTask(created.id());

        assertThrows(ResourceNotFoundException.class, () -> {
            taskService.getTask(created.id());
        });
    }
}
