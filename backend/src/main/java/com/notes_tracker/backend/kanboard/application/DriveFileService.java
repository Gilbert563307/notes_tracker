package com.notes_tracker.backend.kanboard.application;

import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.domain.DriveFile;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import com.notes_tracker.backend.security.application.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriveFileService {

    private final DriveFileRepository driveFileRepository;
    private final UserService userService;

    public DriveFileService(DriveFileRepository driveFileRepository, UserService userService) {
        this.driveFileRepository = driveFileRepository;
        this.userService = userService;
    }

    public Page<DriveFileDto> getFiles(Pageable pageable) {
        String userId = this.userService.getUserIdByAuthentication();
        return this.driveFileRepository.findAllByUserId(userId, pageable)
                .map(DriveFileDto::from);
    }

    public DriveFileDto createFile(DriveFileDto dto) {
        String userId = this.userService.getUserIdByAuthentication();
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

    public DriveFileDto getFile(String fileId) {
        DriveFile file = getFileById(fileId);
        return DriveFileDto.from(file);
    }

    private DriveFile getFileById(String fileId) {
        DriveFile driveFile = this.driveFileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        return  driveFile;
    }

    public DriveFileDto updateFile(DriveFileDto dto) {
        DriveFile file = getFileById(dto.id());
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

    public void deleteFile(String fileId) {
        this.driveFileRepository.deleteById(fileId);
    }

    public void deleteByIdIn(List<String> ids){
        String userId = this.userService.getUserIdByAuthentication();
        this.driveFileRepository.deleteByIdInAndUserId(ids, userId);
    }

    public boolean isDriveFileOwner(final String driveFileId) {
        final String userId = this.userService.getUserIdByAuthentication();
        final DriveFile driveFile = this.driveFileRepository.findById(driveFileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        //does drive file equal to current auth user
        return driveFile.getUserId().equals(userId);
    }
}