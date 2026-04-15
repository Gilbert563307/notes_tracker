package com.notes_tracker.backend.kanboard.data;

import com.notes_tracker.backend.kanboard.domain.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    Page<Task> findAllByUserId(String userId, Pageable pageable);
    Task findTaskByIdAndUserId(String id, String userId);
    void deleteTaskByIdAndUserId(String id, String userId);
}
