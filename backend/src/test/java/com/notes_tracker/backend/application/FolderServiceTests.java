package com.notes_tracker.backend.application;


import com.notes_tracker.backend.kanboard.application.FolderService;
import com.notes_tracker.backend.kanboard.application.dto.FolderDto;
import com.notes_tracker.backend.kanboard.data.FolderRepository;
import com.notes_tracker.backend.kanboard.domain.Folder;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FolderServiceTests {

    @Test
    void createFolder() {
        FolderRepository repo = mock(FolderRepository.class);
        FolderService service = new FolderService(repo);

        Folder folder = new Folder.Builder()
                .name("Folder")
                .userId("user")
                .color("blue")
                .build();

        when(repo.save(any())).thenReturn(folder);

        FolderDto result = service.createFolder(FolderDto.from(folder));

        assertEquals("Folder", result.name());
    }

    @Test
    void updateFolder() {
        FolderRepository repo = mock(FolderRepository.class);
        FolderService service = new FolderService(repo);

        Folder folder = new Folder.Builder()
                .name("Old")
                .userId("user")
                .color("red")
                .build();

        when(repo.findById("1")).thenReturn(Optional.of(folder));
        when(repo.save(any())).thenAnswer(i -> i.getArgument(0));

        FolderDto updated = service.updateFolder(
                new FolderDto(
                        "1",
                        "My Folder",
                        "user-1",
                        "blue",
                        false,
                        null,
                        null
                )
        );

        assertEquals("My Folder", updated.name());
        assertEquals("user-1", updated.userId());
        assertEquals("blue", updated.color());
        assertFalse(updated.archived());
    }
}
