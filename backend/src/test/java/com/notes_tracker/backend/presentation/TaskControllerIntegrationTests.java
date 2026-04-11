package com.notes_tracker.backend.presentation;
import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.domain.Task;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
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
    ObjectMapper objectMapper;

    @AfterEach
    void cleanup() {
        repository.deleteAll();
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void createTask() throws Exception {

        TaskDto dto = new TaskDto(
                null,
                "board-1",
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
                .andExpect(jsonPath("$.kanBoardId").value("board-1"))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.priority").value(1))
                .andExpect(jsonPath("$.assigneId").value("user-1"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void getTaskById() throws Exception {

        Task created = repository.save(
                new Task.Builder()
                        .title("Task A")
                        .kanBoardId("board-1")
                        .build()
        );

        mockMvc.perform(get("/task/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Task A"))
                .andExpect(jsonPath("$.kanBoardId").value("board-1"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void updateTask() throws Exception {

        Task saved = repository.save(
                new Task.Builder()
                        .title("Old")
                        .kanBoardId("board-1")
                        .build()
        );

        TaskDto updateDto = new TaskDto(
                saved.getId(),
                "board-1",
                "Updated",
                "new desc",
                Task.TaskStatus.DONE,
                5,
                "user-2",
                true,
                null,
                null
        );

        mockMvc.perform(put("/task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated"))
                .andExpect(jsonPath("$.status").value("DONE"))
                .andExpect(jsonPath("$.archived").value(true));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void deleteTask() throws Exception {

        Task saved = repository.save(
                new Task.Builder()
                        .title("Task A")
                        .kanBoardId("board-1")
                        .build()
        );

        mockMvc.perform(delete("/task/" + saved.getId()))
                .andExpect(status().isOk());

        assertFalse(repository.findById(saved.getId()).isPresent());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void getTasks() throws Exception {

        repository.save(new Task.Builder()
                .title("Task 1")
                .kanBoardId("board-1")
                .build());

        repository.save(new Task.Builder()
                .title("Task 2")
                .kanBoardId("board-1")
                .build());

        mockMvc.perform(get("/task"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2));
    }

}
