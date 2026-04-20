package com.notes_tracker.backend.application.integration;


import com.notes_tracker.backend.kanboard.application.FolderService;
import com.notes_tracker.backend.kanboard.application.dto.FolderDto;
import com.notes_tracker.backend.kanboard.data.FolderRepository;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class FolderServiceIntegrationTests {

    @Autowired
    FolderService folderService;

    @Autowired
    FolderRepository repository;

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
                .password("securePassword123")
                .build());
    }


    @Test
    @WithMockUser("john@example.com")
    void createFolder() {
        FolderDto dto = new FolderDto(
                null,
                "Folder A",
                this.savedUser.getId(),
                "#8888",
                false,
                null,
                null
        );

        FolderDto result = folderService.createFolder(dto);

        assertNotNull(result.id());
        assertEquals("Folder A", result.name());
        assertEquals( this.savedUser.getId(), result.userId());
        assertEquals("#8888", result.color());
        assertFalse( result.archived());
    }

    @Test
         @WithMockUser("john@example.com")
    void updateAndPersistFolder() {
        FolderDto created = folderService.createFolder(new FolderDto(
                null, "Old",  this.savedUser.getId(), "#000", false, null, null
        ));

        folderService.updateFolder(new FolderDto(
                created.id(),
                "New",
                this.savedUser.getId(),
                "#55555",
                true,
                null,
                null
        ));

        FolderDto fetched = folderService.getFolder(created.id());

        assertEquals("New", fetched.name());
        assertEquals( this.savedUser.getId(), fetched.userId());
        assertEquals("#55555", fetched.color());
        assertTrue(fetched.archived());
    }

    @Test
         @WithMockUser("john@example.com")
    void getFolderById() {
        FolderDto created = folderService.createFolder(new FolderDto(
                null,
                "Folder A",
                this.savedUser.getId(),
                "#00000",
                true,
                null,
                null
        ));

        FolderDto fetched = folderService.getFolder(created.id());

        assertNotNull(fetched);
        assertEquals("Folder A", fetched.name());
        assertEquals( this.savedUser.getId(), fetched.userId());
        assertEquals("#00000", fetched.color());
        assertTrue(fetched.archived());
    }

    @Test
         @WithMockUser("john@example.com")
    void deleteFolder() {
        FolderDto created = folderService.createFolder(new FolderDto(
                null,
                "Folder A",
                this.savedUser.getId(),
                "#00000",
                false,
                null,
                null
        ));

        folderService.deleteFolder(created.id());

        assertThrows(ResourceNotFoundException.class, () -> {
            folderService.getFolder(created.id());
        });
    }
}