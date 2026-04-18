package com.notes_tracker.backend.presentation;


import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;

import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class KanBoardControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private KanBoardRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

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
                .password("securePassword123")
                .build());
    }

    @Test
    @WithMockUser("mock-user")
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
    @WithMockUser("mock-user")
    void getBoardById() throws Exception {
        KanBoard saved = repository.save(new KanBoard.Builder()
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
    @WithMockUser("mock-user")
    void updateBoard() throws Exception {
        KanBoard saved = repository.save(new KanBoard.Builder()
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
    @WithMockUser("mock-user")
    void deleteBoard() throws Exception {
        KanBoard saved = repository.save(new KanBoard.Builder()
                .name("To Be Deleted")
                .userId(savedUser.getId())
                .build());

        mockMvc.perform(delete("/kanboard/" + saved.getId()))
                .andExpect(status().isOk());

        assertFalse(repository.findById(saved.getId()).isPresent());
    }

    @Test
    @WithMockUser("mock-user")
    void getBoardsWithPagination() throws Exception {
        repository.save(new KanBoard.Builder().name("Board 1").userId(savedUser.getId()).build());
        repository.save(new KanBoard.Builder().name("Board 2").userId(savedUser.getId()).build());

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
                .andExpect(status().isForbidden()); // Or isForbidden() depending on your SecurityConfig
    }
}
