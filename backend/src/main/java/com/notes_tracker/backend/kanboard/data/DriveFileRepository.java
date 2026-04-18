package com.notes_tracker.backend.kanboard.data;

import com.notes_tracker.backend.kanboard.domain.DriveFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriveFileRepository extends MongoRepository<DriveFile, String> {
    Page<DriveFile> findAllByUserId(String userId, Pageable pageable);
    DriveFile findDriveFileByIdAndUserId(String id, String userId);
    long deleteByIdInAndUserId(List<String> ids, String userId);
}
