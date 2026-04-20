package com.notes_tracker.backend.application.integration;


import com.notes_tracker.backend.kanboard.application.TaskService;
import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.Task;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class TaskServiceIntegrationTests {

    @Autowired
    TaskService taskService;

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    UserRepository userRepository;

    @AfterEach
    void cleanup() {
        this.taskRepository.deleteAll();
        this.userRepository.deleteAll();
    }

    User savedUser;
    @BeforeEach
    void init() {
        this.savedUser = this.userRepository.save(new User.Builder()
                .displayName("mock-user")
                .emailAddress("john@example.com")
                .password("securePassword123")
                .build());
    }

    @Test
   @WithMockUser("john@example.com")
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
   @WithMockUser("john@example.com")
    void createAndFetchTask() {
        Task created = this.taskRepository.save(
                new Task.Builder().title("Task B")
                        .description("desc")
                        .userId(savedUser.getId())
                        .assigneId(savedUser.getId())
                        .build()
        );


        TaskDto fetched = taskService.getTask(created.getId());

        assertEquals(created.getId(), fetched.id());

        assertEquals("Task B", fetched.title());
        assertEquals("desc", fetched.description());
        assertEquals(Task.TaskStatus.TODO, fetched.status());
        assertEquals(0, fetched.priority());
        assertEquals(savedUser.getId(), fetched.assigneId());
        assertFalse(fetched.archived());

        assertNotNull(fetched.createdAt());
        assertNotNull(fetched.updatedAt());
    }

    @Test
   @WithMockUser("john@example.com")
    void updateTaskAndVerifyPersistence() {
        Task created = this.taskRepository.save(
                new Task.Builder().title("Task B")
                        .description("desc")
                        .userId(savedUser.getId())
                        .build()
        );

        taskService.updateTask(new TaskDto(
                created.getId(),
                "Updated",
                "new desc",
                Task.TaskStatus.DONE,
                5,
                "user-2",
                true,
                null,
                null
        ));

        TaskDto fetched = taskService.getTask(created.getId());

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
   @WithMockUser("john@example.com")
    void getTaskById() {
        Task created = this.taskRepository.save(
                new Task.Builder().title("Task A")
                        .description("desc")
                        .userId(savedUser.getId())
                        .assigneId(savedUser.getId())
                        .priority(1)
                        .build()
        );

        TaskDto fetched = taskService.getTask(created.getId());

        assertNotNull(fetched);

        assertEquals(created.getId(), fetched.id());
        assertEquals("Task A", fetched.title());
        assertEquals("desc", fetched.description());
        assertEquals(Task.TaskStatus.TODO, fetched.status());
        assertEquals(1, fetched.priority());
        assertEquals(savedUser.getId(), fetched.assigneId());
        assertFalse(fetched.archived());

        assertNotNull(fetched.createdAt());
        assertNotNull(fetched.updatedAt());
    }

    @Test
   @WithMockUser("john@example.com")
    void deleteTask() {
        Task created = this.taskRepository.save(
                new Task.Builder().title("Task A")
                        .description("desc")
                        .userId(savedUser.getId())
                        .assigneId(savedUser.getId())
                        .priority(1)
                        .build()
        );

        taskService.deleteTask(created.getId());

        assertThrows(ResourceNotFoundException.class, () -> {
            taskService.getTask(created.getId());
        });
    }
}
