package com.notes_tracker.backend.kanboard.presentation;

import com.notes_tracker.backend.kanboard.application.TaskService;
import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<Page<TaskDto>> getTasks(Pageable pageable, Authentication authentication) {
        return new ResponseEntity<>(taskService.getTasks(pageable, authentication), HttpStatus.OK);
    }

    @PostMapping
    ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto, Authentication authentication) {
        TaskDto created = this.taskService.createTask(taskDto, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("{taskId}")
    ResponseEntity<TaskDto> getTask(@PathVariable String taskId, Authentication authentication) {
        TaskDto task = this.taskService.getTask(taskId, authentication);
        return ResponseEntity.ok(task);
    }

    @PutMapping()
    ResponseEntity<TaskDto> updateTask(@RequestBody TaskDto taskDto, Authentication authentication) {
        TaskDto game = this.taskService.updateTask(taskDto, authentication);
        return ResponseEntity.ok(game);
    }

    @DeleteMapping("{taskId}")
    public void deleteTask(@PathVariable String taskId, Authentication authentication) {
        this.taskService.deleteTask(taskId, authentication);
    }

}
