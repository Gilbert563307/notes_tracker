package com.notes_tracker.backend.domain;

import com.notes_tracker.backend.kanboard.domain.Folder;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class FolderDomainTests {

    @Test
    void shouldBuildValidFolder() {
        Folder folder = new Folder.Builder()
                .name("My Folder")
                .userId("user-1")
                .color("blue")
                .build();

        assertNotNull(folder);
        assertEquals("My Folder", folder.getName());
        assertEquals("blue", folder.getColor());
        assertNotNull(folder.getCreatedAt());
    }

    @Test
    void shouldUpdateFolder() {
        Folder folder = new Folder.Builder()
                .name("Old")
                .userId("user")
                .color("red")
                .build();

        folder.update("New", "user2", "green", true);

        assertEquals("New", folder.getName());
        assertEquals("green", folder.getColor());
        assertTrue(folder.isArchived());
    }
}
