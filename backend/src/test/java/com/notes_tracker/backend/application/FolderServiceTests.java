package com.notes_tracker.backend.application;


import com.notes_tracker.backend.kanboard.application.FolderService;
import com.notes_tracker.backend.kanboard.application.dto.FolderDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.data.FolderRepository;
import com.notes_tracker.backend.kanboard.domain.Folder;
import com.notes_tracker.backend.security.application.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FolderServiceTests {
    private final FolderRepository repo = mock(FolderRepository.class);
    private final DriveFileRepository driveRepo = mock(DriveFileRepository.class);
    private final UserService userService = mock(UserService.class);
    private final FolderService service = new FolderService(this.repo, this.driveRepo, this.userService);


    @BeforeEach
    void init(){
        when(userService.getUserIdByAuthentication()).thenReturn("user-1");
    }

    @Test
    void createFolder() {
        Folder folder = new Folder.Builder()
                .name("Folder")
                .userId("user-1")
                .color("#22222")
                .build();

        when(repo.save(any())).thenReturn(folder);
        FolderDto result = service.createFolder(FolderDto.from(folder));
        assertEquals("Folder", result.name());
    }

    @Test
    void getFolder(){
        Folder folder = new Folder.Builder()
                .name("Folder")
                .userId("user-1")
                .color("#22222")
                .build();

        when(repo.findById("folder01")).thenReturn(Optional.ofNullable(folder));
        FolderDto result = service.getFolder("folder01");
        assertEquals("Folder", result.name());
    }

    @Test
    void updateFolder() {
        Folder folder = new Folder.Builder()
                .name("Old")
                .userId("user-1")
                .color("#22222")
                .build();

        when(repo.findById("1")).thenReturn(Optional.of(folder));
        when(repo.save(any())).thenAnswer(i -> i.getArgument(0));

        FolderDto updated = service.updateFolder(
                new FolderDto(
                        "1",
                        "My Folder",
                        "user-1",
                        "#44444",
                        false,
                        null,
                        null
                )
        );

        assertEquals("My Folder", updated.name());
        assertEquals("user-1", updated.userId());
        assertEquals("#44444", updated.color());
        assertFalse(updated.archived());
    }

    // https://stackoverflow.com/questions/72438479/how-to-mock-page-with-content-data-in-unit-test
    @Test
    void getAllFolders(){
        Pageable pageable = PageRequest.of(1, 1);
        Page<Folder> folderEntityPge =  new PageImpl<>(List.of(new Folder(), new Folder()));

        when(repo.findAllByUserId("user-1",pageable)).thenReturn(folderEntityPge);

        Page<FolderDto> folderDtos = service.getFolders(pageable);
        assertEquals(2, folderDtos.getTotalElements());
    }
}
