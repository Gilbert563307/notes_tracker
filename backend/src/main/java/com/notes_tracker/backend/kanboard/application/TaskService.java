package com.notes_tracker.backend.kanboard.application;

import com.notes_tracker.backend.security.application.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.Task;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;

    public TaskService(TaskRepository taskRepository, UserService userService) {
        this.taskRepository = taskRepository;
        this.userService = userService;
    }

    public Page<TaskDto> getTasks(Pageable pageable, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        return TaskDto.fromTaskList(this.taskRepository.findAllByUserId(userId, pageable));
    }

    public TaskDto createTask(TaskDto taskDto, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        Task task = this.taskRepository.save(
                new Task.Builder()
                        .userId(userId)
                        .title(taskDto.title())
                        .description(taskDto.description())
                        .status(taskDto.status())
                        .priority(taskDto.priority())
                        .assigneId(taskDto.assigneId())
                        .archived(taskDto.archived())
                        .build());
        return TaskDto.from(task);
    }

    public TaskDto getTask(String taskId, Authentication authentication) {
        Task task = this.getTaskById(taskId, authentication);
        return TaskDto.from(task);
    }

    private Task getTaskById(String taskId, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        Task task = this.taskRepository.findTaskByIdAndUserId(taskId, userId);
        if (task == null) {
            throw new ResourceNotFoundException("Task not found by provided id");
        }
        return task;
    }

    public TaskDto updateTask(TaskDto taskDto, Authentication authentication) {
        Task task = this.getTaskById(taskDto.id(), authentication);
        task.updateTask(
                taskDto.title(),
                taskDto.description(),
                taskDto.status(),
                taskDto.priority(),
                taskDto.assigneId(),
                taskDto.archived()
        );
        this.taskRepository.save(task);
        return TaskDto.from(task);
    }

    public void deleteTask(String taskId, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        this.taskRepository.deleteTaskByIdAndUserId(taskId, userId);
    }

    private String getCurrentAuthenticatedUserId(Authentication authentication) {
        return this.userService.getUserIdByDisplayName(authentication.getName());
    }
}
