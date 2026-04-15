package com.notes_tracker.backend.kanboard.application;

import com.notes_tracker.backend.kanboard.application.dto.FolderDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.data.FolderRepository;
import com.notes_tracker.backend.kanboard.domain.DriveFile;
import com.notes_tracker.backend.kanboard.domain.Folder;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import com.notes_tracker.backend.security.application.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class FolderService {

    private final FolderRepository folderRepository;
    private final DriveFileRepository driveFileRepository;
    private final UserService userService;

    public FolderService(FolderRepository folderRepository, DriveFileRepository driveFileRepository, UserService userService) {
        this.folderRepository = folderRepository;
        this.driveFileRepository = driveFileRepository;
        this.userService = userService;
    }

    public Page<FolderDto> getFolders(Pageable pageable, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        return folderRepository.findAllByUserId(userId, pageable)
                .map(FolderDto::from);
    }

    public FolderDto createFolder(FolderDto dto, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        Folder folder = this.folderRepository.save(
                new Folder.Builder()
                .name(dto.name())
                .userId(userId)
                .color(dto.color())
                .archived(dto.archived())
                .build());
        return FolderDto.from(folder);
    }

    public FolderDto getFolder(String folderId, Authentication authentication) {
        Folder folder = this.getFolderById(folderId, authentication);
        return FolderDto.from(folder);
    }

    public void assignDriveFileToFolder(String folderId, String driveFileId, Authentication authentication) {
        Folder folder = this.getFolderById(folderId, authentication);
        folder.addDriveFileToFolder(this.getDriveFileById(driveFileId, authentication));
    }

    public FolderDto updateFolder(FolderDto dto, Authentication authentication) {
        Folder folder = getFolderById(dto.id(), authentication);
        folder.update(
                dto.name(),
                dto.userId(),
                dto.color(),
                dto.archived()
        );
        this.folderRepository.save(folder);
        return FolderDto.from(folder);
    }

    public void deleteFolder(String folderId, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        this.folderRepository.deleteFolderByIdAndUserId(folderId, userId);
    }

    private Folder getFolderById(String folderId, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        Folder folder =  this.folderRepository.findFolderByIdAndUserId(folderId, userId);
        if (folder == null) {
            throw new ResourceNotFoundException("Folder not found");
        }
        return folder;
    }

    private DriveFile getDriveFileById(String driveFileId, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        DriveFile driveFile =  this.driveFileRepository.findDriveFileByIdAndUserId(driveFileId, userId);
        if (driveFile == null) {
            throw new ResourceNotFoundException("Folder not found");
        }
        return driveFile;
    }

    private String getCurrentAuthenticatedUserId(Authentication authentication) {
        return this.userService.getUserIdByDisplayName(authentication.getName());
    }
}