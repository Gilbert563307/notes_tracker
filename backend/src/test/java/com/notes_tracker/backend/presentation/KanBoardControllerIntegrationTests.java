package com.notes_tracker.backend.presentation;


import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.application.request.AddNewTaskToKanBoard;
import com.notes_tracker.backend.kanboard.application.request.AddTaskToKanBoardRequest;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.Task;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import org.junit.jupiter.api.AfterEach;

import static org.hamcrest.Matchers.hasSize;

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

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;

import tools.jackson.databind.ObjectMapper;

import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class KanBoardControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private KanBoardRepository kanBoardRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    TaskRepository taskRepository;

    @AfterEach
    void cleanup() {
        this.kanBoardRepository.deleteAll();
        this.userRepository.deleteAll();
        this.taskRepository.deleteAll();
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
    void createBoard() throws Exception {
        KanBoardDto dto = new KanBoardDto(
                null, "New Board", savedUser.getId(), "#11111", false, true, "img.png", null, null
        );

        mockMvc.perform(post("/kanboard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("New Board"))
                .andExpect(jsonPath("$.color").value("#11111"))
                .andExpect(jsonPath("$.collaborative").value(true));
    }

    @Test
    @WithMockUser("john@example.com")
    void getBoardById() throws Exception {
        KanBoard saved = kanBoardRepository.save(new KanBoard.Builder()
                .name("Persistent Board")
                .userId(savedUser.getId())
                .color("#00000")
                .build());

        mockMvc.perform(get("/kanboard/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.name").value("Persistent Board"))
                .andExpect(jsonPath("$.color").value("#00000"));
    }

    @Test
    @WithMockUser("john@example.com")
    void updateBoard() throws Exception {
        KanBoard saved = kanBoardRepository.save(new KanBoard.Builder()
                .name("Old Name")
                .userId(savedUser.getId())
                .build());

        KanBoardDto updateDto = new KanBoardDto(
                saved.getId(), "Updated Name", savedUser.getId(), "#4444", true, true, "new-img.png", null, null
        );

        mockMvc.perform(put("/kanboard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"))
                .andExpect(jsonPath("$.archived").value(true));
    }

    @Test
    @WithMockUser("john@example.com")
    void deleteBoard() throws Exception {
        KanBoard saved = kanBoardRepository.save(new KanBoard.Builder()
                .name("To Be Deleted")
                .userId(savedUser.getId())
                .build());

        mockMvc.perform(delete("/kanboard/" + saved.getId()))
                .andExpect(status().isOk());

        assertFalse(kanBoardRepository.findById(saved.getId()).isPresent());
    }

    @Test
    @WithMockUser("john@example.com")
    void getBoardsWithPagination() throws Exception {
        kanBoardRepository.save(new KanBoard.Builder().name("Board 1").userId(savedUser.getId()).build());
        kanBoardRepository.save(new KanBoard.Builder().name("Board 2").userId(savedUser.getId()).build());

        mockMvc.perform(get("/kanboard")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    void shouldReturnUnauthorizedWhenNoUser() throws Exception {
        mockMvc.perform(get("/kanboard"))
                .andExpect(status().isUnauthorized()); // Or isForbidden() depending on your SecurityConfig
    }

    @Test
    @WithMockUser("john@example.com")
    void getTasksByKanBoardId() throws Exception {
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

        KanBoard created = this.kanBoardRepository.save(board);

        this.mockMvc.perform(get("/kanboard/" + created.getId() + "/tasks"))
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser("john@example.com")
    void addTaskToKanBoard() throws Exception {
        //arrange
        Task task = this.taskRepository.save(new Task.Builder()
                .title("Test")
                .userId(savedUser.getId())
                .build());

        KanBoard board = this.kanBoardRepository.save(new KanBoard.Builder()
                .name("Old")
                .userId(savedUser.getId())
                .build());

        this.mockMvc.perform(patch("/kanboard/task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(
                                        new AddTaskToKanBoardRequest(task.getId(), board.getId())
                                )
                        )
                ).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
        ;
    }

    @Test
    @WithMockUser("john@example.com")
    void addNewTaskToKanBoard() throws Exception {
        KanBoard board = new KanBoard.Builder()
                .name("Old")
                .userId(this.savedUser.getId())
                .build();

        KanBoard created = this.kanBoardRepository.save(board);

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
        String url = String.format("/kanboard/%s/task", created.getId());

        this.mockMvc.perform(patch(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        objectMapper.writeValueAsString(
                                new AddNewTaskToKanBoard(taskDto)
                        )
                ))
                .andExpect(status().isOk()).andExpect(
                        jsonPath("$", hasSize(1))
        );

    }
}
