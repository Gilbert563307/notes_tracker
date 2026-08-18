package com.notes_tracker.backend.kanboard.application;

import com.notes_tracker.backend.kanboard.application.dto.TaskInformationDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
import com.notes_tracker.backend.security.application.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.Task;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final KanBoardRepository kanBoardRepository;
    private final UserService userService;

    public TaskService(TaskRepository taskRepository, KanBoardRepository kanBoardRepository, UserService userService) {
        this.taskRepository = taskRepository;
        this.kanBoardRepository = kanBoardRepository;
        this.userService = userService;
    }

    public Page<TaskDto> getTasks(Pageable pageable) {
        String userId = this.userService.getUserIdByAuthentication();
        return TaskDto.fromTaskList(this.taskRepository.findAllByUserId(userId, pageable));
    }

    public TaskDto createTask(TaskDto taskDto) {
        String userId = this.userService.getUserIdByAuthentication();
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

    public TaskInformationDto getTask(String taskId) {
        Task task = this.getTaskById(taskId);
        KanBoard kanBoard = this.kanBoardRepository.findKanBoardByTasksContains(List.of(task));

        String assignee = this.userService.getAssigneeOrReporterById(task.getAssigneId());

        //TODO for now the reporter is always you
        String reporter =  this.userService.getAssigneeOrReporterById(this.userService.getUserIdByAuthentication());
        return TaskInformationDto.from(TaskDto.from(task), kanBoard.getName(), assignee, reporter);

    }

    private Task getTaskById(String taskId) {
        return this.taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("Task not found. No task exists with the provided ID: " + taskId));
    }

    public TaskInformationDto updateTask(TaskDto taskDto) {
        Task task = this.getTaskById(taskDto.id());
        task.updateTask(
                taskDto.title(),
                taskDto.description(),
                taskDto.status(),
                taskDto.priority(),
                taskDto.assigneId(),
                taskDto.archived()
        );
        this.taskRepository.save(task);

        KanBoard kanBoard = this.kanBoardRepository.findKanBoardByTasksContains(List.of(task));
        String assignee = this.userService.getAssigneeOrReporterById(task.getAssigneId());
        //TODO for now the reporter is always you
        String reporter =  this.userService.getAssigneeOrReporterById(this.userService.getUserIdByAuthentication());
        return TaskInformationDto.from(TaskDto.from(task), kanBoard.getName(), assignee, reporter);
    }

    public void deleteTask(String taskId) {
        this.taskRepository.deleteById(taskId);
    }

    public void deleteByIdIn(List<String> ids){
        String userId = this.userService.getUserIdByAuthentication();
        this.taskRepository.deleteByIdInAndUserId(ids, userId);
    }

    public boolean isTaskOwner(final String id) {
        final String userId = this.userService.getUserIdByAuthentication();
        final Task task = this.taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found. No task exists with the provided ID: " + id));
        //does drive file equal to current auth user
        return task.getUserId().equals(userId);
    }
}
