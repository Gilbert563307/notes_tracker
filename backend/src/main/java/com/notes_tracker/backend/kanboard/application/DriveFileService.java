package com.notes_tracker.backend.kanboard.application;

import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.domain.DriveFile;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DriveFileService {

    private final DriveFileRepository driveFileRepository;

    public DriveFileService(DriveFileRepository driveFileRepository) {
        this.driveFileRepository = driveFileRepository;
    }

    public Page<DriveFileDto> getFiles(Pageable pageable) {
        return driveFileRepository.findAll(pageable)
                .map(DriveFileDto::from);
    }

    public DriveFileDto createFile(DriveFileDto dto) {
        DriveFile file = driveFileRepository.save(dto.toDomain());
        return DriveFileDto.from(file);
    }

    public DriveFileDto getFile(String fileId) {
        DriveFile file = getFileById(fileId);
        return DriveFileDto.from(file);
    }

    private DriveFile getFileById(String fileId) {
        return driveFileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
    }

    public DriveFileDto updateFile(DriveFileDto dto) {
        DriveFile file = getFileById(dto.id());

        file.update(
                dto.name(),
//                dto.folderId(),
                dto.userId(),
                dto.size(),
                dto.type(),
                dto.archived()
        );

        driveFileRepository.save(file);
        return DriveFileDto.from(file);
    }

    public void deleteFile(String fileId) {
        driveFileRepository.deleteById(fileId);
    }
}