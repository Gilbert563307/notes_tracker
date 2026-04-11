package com.notes_tracker.backend.domain;


import com.notes_tracker.backend.kanboard.domain.DriveFile;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DriveFileDomainTests {

    @Test
    void shouldBuildValidFile() {
        DriveFile file = new DriveFile.Builder()
                .name("file.pdf")
                .folderId("folder-1")
                .userId("user-1")
                .size("1024")
                .type("PDF")
                .build();

        assertNotNull(file);
        assertEquals("file.pdf", file.getName());
        assertEquals("PDF", file.getType());
        assertNotNull(file.getCreatedAt());
    }

    @Test
    void shouldThrowWhenFileTooLarge() {
        assertThrows(IllegalArgumentException.class, () -> {
            new DriveFile.Builder()
                    .name("file.pdf")
                    .folderId("1")
                    .userId("user")
                    .size(String.valueOf(200 * 1024 * 1024)) // 200MB
                    .type("PDF")
                    .build();
        });
    }

    @Test
    void shouldThrowWhenTypeInvalid() {
        assertThrows(IllegalArgumentException.class, () -> {
            new DriveFile.Builder()
                    .name("file.exe")
                    .folderId("1")
                    .userId("user")
                    .size("100")
                    .type("EXE")
                    .build();
        });
    }

    @Test
    void shouldUpdateFile() {
        DriveFile file = new DriveFile.Builder()
                .name("old.pdf")
                .folderId("1")
                .userId("user")
                .size("100")
                .type("PDF")
                .build();

        file.update("new.pdf", "2", "user2", "200", "PDF", true);

        assertEquals("new.pdf", file.getName());
        assertTrue(file.isArchived());
    }
}
