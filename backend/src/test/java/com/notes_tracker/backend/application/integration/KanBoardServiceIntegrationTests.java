package com.notes_tracker.backend.application.integration;


import com.notes_tracker.backend.kanboard.application.KanBoardService;
import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.application.request.AddNewTaskToKanBoard;
import com.notes_tracker.backend.kanboard.application.request.AddTaskToKanBoardRequest;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
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

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class KanBoardServiceIntegrationTests {

    @Autowired
    KanBoardService kanBoardService;

    @Autowired
    KanBoardRepository repository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TaskRepository taskRepository;

    @AfterEach
    void cleanup() {
        repository.deleteAll();
        this.userRepository.deleteAll();
        this.taskRepository.deleteAll();
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
    void createBoard() {
        KanBoardDto dto = new KanBoardDto(
                null,
                "Board A",
                this.savedUser.getId(),
                "#4444",
                false,
                true,
                "img.png",
                null,
                null
        );

        KanBoardDto result = kanBoardService.createBoard(dto);

        assertNotNull(result.id());
        assertEquals("Board A", result.name());
        assertEquals(  this.savedUser.getId(), result.userId());
        assertEquals("#4444", result.color());
        assertEquals("img.png", result.imageUrl());
        assertFalse(result.archived());
        assertTrue(result.collaborative());

        assertNotNull(result.createdAt());
        assertNotNull(result.updatedAt());
    }

    @Test
    @WithMockUser("john@example.com")
    void updateAndPersistBoard() {
        KanBoard created = this.repository.save(
                new KanBoard.Builder()
                        .name("Old")
                        .userId( this.savedUser.getId())
                        .imageUrl("img")
                        .build()
        );

        kanBoardService.updateBoard(new KanBoardDto(
                created.getId(),
                "Updated",
                this.savedUser.getId(),
                "#8888",
                true,
                true,
                "img2",
                null,
                null
        ));

        KanBoardDto fetched = kanBoardService.getBoard(  created.getId());

        assertEquals("Updated", fetched.name());
        assertEquals(  this.savedUser.getId(), fetched.userId());
        assertEquals("#8888", fetched.color());
        assertEquals("img2", fetched.imageUrl());
        assertTrue(fetched.archived());
        assertTrue(fetched.collaborative());

        assertNotNull(fetched.createdAt());
        assertNotNull(fetched.updatedAt());
    }

    @Test
    @WithMockUser("john@example.com")
    void getBoardById() {
        KanBoardDto created = kanBoardService.createBoard(new KanBoardDto(
                null,
                "Board A",
                this.savedUser.getId(),
                "#8888",
                false,
                true,
                "img.png",
                null,
                null
        ));

        KanBoardDto fetched = kanBoardService.getBoard(created.id());

        assertNotNull(fetched);

        assertEquals(created.id(), fetched.id());
        assertEquals("Board A", fetched.name());
        assertEquals(  this.savedUser.getId(), fetched.userId());
        assertEquals("#8888", fetched.color());
        assertEquals("img.png", fetched.imageUrl());
        assertFalse(fetched.archived());
        assertTrue(fetched.collaborative());

        assertNotNull(fetched.createdAt());
        assertNotNull(fetched.updatedAt());
    }

    @Test
    @WithMockUser("john@example.com")
    void deleteBoard() {
        KanBoardDto created = kanBoardService.createBoard(new KanBoardDto(
                null,
                "Board A",
                this.savedUser.getId(),
                "#8888",
                false,
                true,
                "img.png",
                null,
                null
        ));

        kanBoardService.deleteBoard(created.id());

        assertThrows(ResourceNotFoundException.class, () -> {
            kanBoardService.getBoard(created.id());
        });
    }

    @Test
    @WithMockUser("john@example.com")
    void getTasksByKanBoardId() {
        Task task = new Task.Builder()
                .title("Test")
                .userId("user-1")
                .build();

        Task task2 = new Task.Builder()
                .title("Test2")
                .userId("user-1")
                .build();

        Task task3 = new Task.Builder()
                .title("Test")
                .userId("user-1")
                .build();

        List<Task> savedTasks = this.taskRepository.saveAll(List.of(task, task2, task3));

        KanBoard board = new KanBoard.Builder()
                .name("Old")
                .userId("user")
                .tasks(savedTasks)
                .build();

        KanBoard created = this.repository.save(board);
        List<TaskDto> taskDtoList = this.kanBoardService.getTasksByKanBoardId(created.getId());
        assertNotNull(taskDtoList);
        assertEquals(3, taskDtoList.size());
    }

    @Test
    @WithMockUser("john@example.com")
    void addTaskToKanBoard(){
        //arrange
        Task task = this.taskRepository.save(new Task.Builder()
                .title("Test")
                .userId("user-1")
                .build());

        KanBoard board = this.repository.save(new KanBoard.Builder()
                .name("Old")
                .userId("user")
                .build());

        List<TaskDto> taskDtoList = this.kanBoardService.addTaskToKanBoard(
                new AddTaskToKanBoardRequest(task.getId(), board.getId())
        );
        assertNotNull(taskDtoList);
        assertEquals(1, taskDtoList.size());
    }

    @Test
    @WithMockUser("john@example.com")
    void addNewTaskToKanBoard(){
        KanBoard board = new KanBoard.Builder()
                .name("Old")
                .userId(this.savedUser.getId())
                .build();

        KanBoard created = this.repository.save(board);

        TaskDto taskDto = new TaskDto(
                null,
                "Task A",
                "desc",
                Task.TaskStatus.TODO,
                1,
                this.savedUser.getId(),
                false,
                null,
                null
        );

        List<TaskDto> taskDtoList = this.kanBoardService.addNewTaskToKanBoard(
                new AddNewTaskToKanBoard(taskDto), created.getId()
        );
        assertNotNull(taskDtoList);
        assertEquals(1, taskDtoList.size());
    }
}
