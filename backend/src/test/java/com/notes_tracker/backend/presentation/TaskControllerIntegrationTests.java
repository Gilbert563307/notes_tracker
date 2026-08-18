package com.notes_tracker.backend.presentation;
import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
import com.notes_tracker.backend.kanboard.domain.Task;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TaskControllerIntegrationTests {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    TaskRepository repository;

    @Autowired
    KanBoardRepository kanBoardRepository;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    UserRepository userRepository;

    @AfterEach
    void cleanup() {
        repository.deleteAll();
        this.userRepository.deleteAll();
    }

    User savedUser;
    @BeforeEach
    void init() {
        this.savedUser = this.userRepository.save(new User.Builder()
                .displayName("mock-user")
                .emailAddress("john@example.com")

                .build());
    }

    @Test
    @WithMockUser("john@example.com")
    void createTask() throws Exception {

        TaskDto dto = new TaskDto(
                null,
//                "board-1",
                "Task A",
                "desc",
                Task.TaskStatus.TODO,
                1,
                "user-1",
                false,
                null,
                null
        );

        mockMvc.perform(post("/task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Task A"))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.priority").value(1))
                .andExpect(jsonPath("$.assigneId").value("user-1"));
    }

    @Test
    @WithMockUser("john@example.com")
    void getTaskById() throws Exception {

        Task created = repository.save(
                new Task.Builder()
                        .title("Task A")
                        .userId(savedUser.getId())
                        .assigneId(savedUser.getId())
                        .build()
        );

        KanBoard board = kanBoardRepository.save(new KanBoard.Builder()
                .name("Persistent Board")
                .userId(savedUser.getId())
                .color("#00000")
                .build());
        board.assignTask(created);
        this.kanBoardRepository.save(board);

        mockMvc.perform(get("/task/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.task.title").value("Task A"));

    }

    @Test
    @WithMockUser("john@example.com")
    void updateTask() throws Exception {

        Task saved = repository.save(
                new Task.Builder()
                        .title("title")
                        .userId(savedUser.getId())
//                        .kanBoardId("board-1")
                        .build()
        );

        KanBoard board = kanBoardRepository.save(new KanBoard.Builder()
                .name("Persistent Board")
                .userId(savedUser.getId())
                .color("#00000")
                .build());
        board.assignTask(saved);
        this.kanBoardRepository.save(board);

        TaskDto updateDto = new TaskDto(
                saved.getId(),
//                "board-1",
                "Updated",
                "new desc",
                Task.TaskStatus.DONE,
                5,
                savedUser.getId(),
                true,
                null,
                null
        );

        mockMvc.perform(put("/task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.task.title").value("Updated"))
                .andExpect(jsonPath("$.task.status").value("DONE"))
                .andExpect(jsonPath("$.task.archived").value(true));
    }

    @Test
    @WithMockUser("john@example.com")
    void deleteTask() throws Exception {

        Task saved = repository.save(
                new Task.Builder()
                        .title("Task A")
                        .userId(savedUser.getId())
//                        .kanBoardId("board-1")
                        .build()
        );

        mockMvc.perform(delete("/task/" + saved.getId()))
                .andExpect(status().isOk());

        assertFalse(repository.findById(saved.getId()).isPresent());
    }

    @Test
    @WithMockUser("john@example.com")
    void getTasks() throws Exception {

        repository.save(new Task.Builder()
                .title("Task 1")
                .userId(savedUser.getId())
                .build());

        repository.save(new Task.Builder()
                .title("Task 2")
                .userId(savedUser.getId())
                .build());

        mockMvc.perform(get("/task"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2));
    }

}
