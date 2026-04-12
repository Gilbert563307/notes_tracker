package com.notes_tracker.backend.kanboard.application.dto;
import com.notes_tracker.backend.kanboard.domain.Task;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;


public record TaskDto(
        String id,
//        String kanBoardId,
        String title,
        String description,
        Task.TaskStatus status,
        int priority,
        String assigneId,
        boolean archived,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static TaskDto from(Task task) {
        return new TaskDto(
                task.getId(),
//                task.getKanBoardId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getAssigneId(),
                task.isArchived(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }

    public static Page<TaskDto> fromTaskList(Page<Task> taskList){
        return taskList.map(task -> new TaskDto(
                task.getId(),
//                task.getKanBoardId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getAssigneId(),
                task.isArchived(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        ));
    }

    public Task toDomain() {
        return new Task.Builder()
//                .kanBoardId(this.kanBoardId)
                .title(this.title)
                .description(this.description)
                .status(this.status)
                .priority(this.priority)
                .assigneId(this.assigneId)
                .archived(this.archived)
                .build();
    }
}