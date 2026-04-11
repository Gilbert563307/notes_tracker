package com.notes_tracker.backend.application;


import com.notes_tracker.backend.kanboard.application.DriveFileService;
import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.domain.DriveFile;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DriveFileServiceTests {

    @Test
    void createFile() {
        DriveFileRepository repo = mock(DriveFileRepository.class);
        DriveFileService service = new DriveFileService(repo);

        DriveFile file = new DriveFile.Builder()
                .name("file.pdf")
                .folderId("1")
                .userId("user")
                .size("100")
                .type("PDF")
                .build();

        when(repo.save(any())).thenReturn(file);

        DriveFileDto result = service.createFile(DriveFileDto.from(file));

        assertEquals("file.pdf", result.name());
    }

    @Test
    void updateFile() {
        DriveFileRepository repo = mock(DriveFileRepository.class);
        DriveFileService service = new DriveFileService(repo);

        DriveFile file = new DriveFile.Builder()
                .name("old.pdf")
                .folderId("1")
                .userId("user")
                .size("100")
                .type("PDF")
                .build();

        when(repo.findById("1")).thenReturn(Optional.of(file));
        when(repo.save(any())).thenAnswer(i -> i.getArgument(0));

        DriveFileDto updated = service.updateFile(
                new DriveFileDto(
                        "1",
                        "file.pdf",
                        "folder-1",
                        "user-1",
                        "1024",
                        "PDF",
                        false,
                        null,
                        null
                )
        );

        assertEquals("file.pdf", updated.name());
        assertEquals("folder-1", updated.folderId());
        assertEquals("user-1", updated.userId());
        assertEquals("1024", updated.size());
        assertEquals("PDF", updated.type());
        assertFalse(updated.archived());
    }
}
