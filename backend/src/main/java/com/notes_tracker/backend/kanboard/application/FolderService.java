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

import java.util.List;

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

    public Page<FolderDto> getFolders(Pageable pageable) {
        String userId = this.userService.getUserIdByAuthentication();
        return folderRepository.findAllByUserId(userId, pageable)
                .map(FolderDto::from);
    }

    public FolderDto createFolder(FolderDto dto) {
        String userId = this.userService.getUserIdByAuthentication();
        Folder folder = this.folderRepository.save(
                new Folder.Builder()
                .name(dto.name())
                .userId(userId)
                .color(dto.color())
                .archived(dto.archived())
                .build());
        return FolderDto.from(folder);
    }

    public FolderDto getFolder(String folderId) {
        Folder folder = this.getFolderById(folderId);
        return FolderDto.from(folder);
    }

    //also needs pre authorize check
    public void assignDriveFileToFolder(String folderId, String driveFileId) {
        Folder folder = this.getFolderById(folderId);
        folder.addDriveFileToFolder(this.getDriveFileById(driveFileId));
    }

    public FolderDto updateFolder(FolderDto dto) {
        Folder folder = getFolderById(dto.id());
        folder.update(
                dto.name(),
                dto.userId(),
                dto.color(),
                dto.archived()
        );
        this.folderRepository.save(folder);
        return FolderDto.from(folder);
    }

    public void deleteFolder(String folderId) {
        this.folderRepository.deleteById(folderId);
    }

    private Folder getFolderById(String folderId) {
        Folder folder =  this.folderRepository.findById(folderId)
                .orElseThrow(() -> new  ResourceNotFoundException("Folder not found"));
        return folder;
    }

    private DriveFile getDriveFileById(String driveFileId) {
        String userId = this.userService.getUserIdByAuthentication();
        //TODO WHEN AUTHORIZE CHECK IS DONE FIX:
        DriveFile driveFile =  this.driveFileRepository.findDriveFileByIdAndUserId(driveFileId, userId);
        if (driveFile == null) {
            throw new ResourceNotFoundException("Folder not found");
        }
        return driveFile;
    }

    public void deleteByIdIn(List<String> ids){
        String userId = this.userService.getUserIdByAuthentication();
        this.folderRepository.deleteByIdInAndUserId(ids, userId);
    }

    public boolean isFolderOwner(final String id) {
        final String userId = this.userService.getUserIdByAuthentication();
        final Folder folder = this.folderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
        //does drive file equal to current auth user
        return folder.getUserId().equals(userId);
    }
}