package com.notes_tracker.backend.kanboard.data;

import com.notes_tracker.backend.kanboard.domain.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
}
