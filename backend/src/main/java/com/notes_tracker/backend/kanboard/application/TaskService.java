package com.notes_tracker.backend.kanboard.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.Task;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Page<TaskDto> getTasks(Pageable pageable) {
        return TaskDto.fromTaskList(this.taskRepository.findAll(pageable));
    }

    public TaskDto createTask(TaskDto taskDto) {
        Task task = this.taskRepository.save(taskDto.toDomain());
        return TaskDto.from(task);
    }

    public TaskDto getTask(String taskId) {
        Task task = this.getTaskById(taskId);
        return TaskDto.from(task);
    }

    private Task getTaskById(String taskId) {
        return this.taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found by provided id"));
    }

    public TaskDto updateTask(TaskDto taskDto) {
        Task task = this.getTaskById(taskDto.id());
        task.updateTask(
                taskDto.title(),
                taskDto.kanBoardId(),
                taskDto.description(),
                taskDto.status(),
                taskDto.priority(),
                taskDto.assigneId(),
                taskDto.archived()
        );
        this.taskRepository.save(task);
        return TaskDto.from(task);
    }

    public void deleteTask(String taskId) {
        this.getTaskById(taskId);
        this.taskRepository.deleteById(taskId);
    }
}
