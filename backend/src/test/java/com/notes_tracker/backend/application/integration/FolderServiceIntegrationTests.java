package com.notes_tracker.backend.application.integration;


import com.notes_tracker.backend.kanboard.application.FolderService;
import com.notes_tracker.backend.kanboard.application.dto.FolderDto;
import com.notes_tracker.backend.kanboard.data.FolderRepository;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class FolderServiceIntegrationTests {

    @Autowired
    FolderService folderService;

    @Autowired
    FolderRepository repository;

    @AfterEach
    void cleanup() {
        repository.deleteAll();
    }

    @Test
    void createFolder() {
        FolderDto dto = new FolderDto(
                null,
                "Folder A",
                "user-1",
                "blue",
                false,
                null,
                null
        );

        FolderDto result = folderService.createFolder(dto);

        assertNotNull(result.id());
        assertEquals("Folder A", result.name());
        assertEquals("user-1", result.userId());
        assertEquals("blue", result.color());
        assertFalse( result.archived());
    }

    @Test
    void updateAndPersistFolder() {
        FolderDto created = folderService.createFolder(new FolderDto(
                null, "Old", "user-1", "red", false, null, null
        ));

        folderService.updateFolder(new FolderDto(
                created.id(),
                "New",
                "user-2",
                "green",
                true,
                null,
                null
        ));

        FolderDto fetched = folderService.getFolder(created.id());

        assertEquals("New", fetched.name());
        assertEquals("user-2", fetched.userId());
        assertEquals("green", fetched.color());
        assertTrue(fetched.archived());
    }

    @Test
    void getFolderById() {
        FolderDto created = folderService.createFolder(new FolderDto(
                null,
                "Folder A",
                "user-1",
                "blue",
                true,
                null,
                null
        ));

        FolderDto fetched = folderService.getFolder(created.id());

        assertNotNull(fetched);
        assertEquals("Folder A", fetched.name());
        assertEquals("user-1", fetched.userId());
        assertEquals("blue", fetched.color());
        assertTrue(fetched.archived());
    }

    @Test
    void deleteFolder() {
        FolderDto created = folderService.createFolder(new FolderDto(
                null,
                "Folder A",
                "user-1",
                "blue",
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