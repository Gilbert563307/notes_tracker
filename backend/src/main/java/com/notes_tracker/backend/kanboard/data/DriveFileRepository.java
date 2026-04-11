package com.notes_tracker.backend.kanboard.data;

import com.notes_tracker.backend.kanboard.domain.DriveFile;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DriveFileRepository extends MongoRepository<DriveFile, String> {
}
