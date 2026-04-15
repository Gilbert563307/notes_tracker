package com.notes_tracker.backend.kanboard.data;

import com.notes_tracker.backend.kanboard.domain.DriveFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriveFileRepository extends MongoRepository<DriveFile, String> {
    Page<DriveFile> findAllByUserId(String userId, Pageable pageable);
    DriveFile findDriveFileByIdAndUserId(String id, String userId);
    void deleteKanBoardByIdAndUserId(String id, String userId);
}
