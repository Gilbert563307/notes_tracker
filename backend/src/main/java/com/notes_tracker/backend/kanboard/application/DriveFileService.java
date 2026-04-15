package com.notes_tracker.backend.kanboard.application;

import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.domain.DriveFile;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import com.notes_tracker.backend.security.application.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class DriveFileService {

    private final DriveFileRepository driveFileRepository;
    private final UserService userService;

    public DriveFileService(DriveFileRepository driveFileRepository, UserService userService) {
        this.driveFileRepository = driveFileRepository;
        this.userService = userService;
    }

    public Page<DriveFileDto> getFiles(Pageable pageable, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        return this.driveFileRepository.findAllByUserId(userId, pageable)
                .map(DriveFileDto::from);
    }

    public DriveFileDto createFile(DriveFileDto dto, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        DriveFile file = this.driveFileRepository.save(
                new DriveFile.Builder()
                .name(dto.name())
                .userId(userId)
                .size(dto.size())
                .type(dto.type())
                .archived(dto.archived())
                .build());
        return DriveFileDto.from(file);
    }

    public DriveFileDto getFile(String fileId, Authentication authentication) {
        DriveFile file = getFileById(fileId, authentication);
        return DriveFileDto.from(file);
    }

    private DriveFile getFileById(String fileId, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        DriveFile driveFile = this.driveFileRepository.findDriveFileByIdAndUserId(fileId, userId);
        if (driveFile == null){
            throw  new ResourceNotFoundException("File not found");
        }
        return  driveFile;
    }

    public DriveFileDto updateFile(DriveFileDto dto, Authentication authentication) {
        DriveFile file = getFileById(dto.id(), authentication);
        file.update(
                dto.name(),
                dto.userId(),
                dto.size(),
                dto.type(),
                dto.archived()
        );
        this.driveFileRepository.save(file);
        return DriveFileDto.from(file);
    }

    public void deleteFile(String fileId, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        this.driveFileRepository.deleteKanBoardByIdAndUserId(fileId, userId);
    }

    private String getCurrentAuthenticatedUserId(Authentication authentication) {
        return this.userService.getUserIdByDisplayName(authentication.getName());
    }
}