package com.notes_tracker.backend.application;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.notes_tracker.backend.kanboard.application.dto.TaskInformationDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
import com.notes_tracker.backend.security.application.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.notes_tracker.backend.kanboard.application.TaskService;
import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.Task;

public class TaskServiceTests {
    private final TaskRepository repo =mock(TaskRepository.class);
    private final UserService userService = mock(UserService.class);
    private final KanBoardRepository kanBoardRepository = mock(KanBoardRepository.class);
    private final  TaskService service = new TaskService(this.repo, this.kanBoardRepository, this.userService);

    @BeforeEach
    void init(){
        when(userService.getUserIdByAuthentication()).thenReturn("user-1");
    }

    @Test
    void createTask() {
        
        Task task = new Task.Builder()
                .title("Test")
                // .kanBoardId("1")
                .userId("user-1")
                .build();

        when(repo.save(any(Task.class))).thenReturn(task);

        TaskDto result = service.createTask(TaskDto.from(task));

        verify(repo).save(any(Task.class));
        assertNotNull(result);
        assertEquals("Test", result.title());
    }

    @Test
    void getTask() {

        Task task = new Task.Builder()
                .title("Test")
                .userId("user-1")
                .build();

        KanBoard board = new KanBoard.Builder()
                .name("Board")
                .userId("user-1")
                .color("#33333")
                .archived(true)
                .collaborative(true)
                .imageUrl("img.png")

                .build();

        List<Task> tasks = new ArrayList<>();
        tasks.add(task);

        when(this.kanBoardRepository.findKanBoardByTasksContains(tasks)).thenReturn(board);
        when(repo.findById("1")).thenReturn(Optional.of(task));

        TaskInformationDto result = service.getTask("1");

        verify(repo).findById("1");
        assertEquals("Test", result.task().title());
    }

    @Test
    void updateTask() {
        Task task = new Task.Builder()
                .title("Old3")
                // .kanBoardId("1")
                .userId("user-1")
                .build();

        KanBoard board = new KanBoard.Builder()
                .name("Board")
                .userId("user-1")
                .color("#33333")
                .archived(true)
                .collaborative(true)
                .imageUrl("img.png")
                        .build();

        when(this.kanBoardRepository.findKanBoardByTasksContains(List.of(task))).thenReturn(board);
        when(repo.findById("1")).thenReturn(Optional.of(task));
        when(repo.save(any())).thenAnswer(i -> i.getArgument(0));

        TaskInformationDto res = service.updateTask(
                new TaskDto(
                        "1",
                        "neww",
                        "desc",
                        Task.TaskStatus.DOING,
                        2,
                        "user",
                        false,
                        null,
                        null
                )
        );
        TaskDto updated = res.task();
        assertEquals("neww", updated.title());
        assertEquals("desc", updated.description());
        assertEquals(Task.TaskStatus.DOING, updated.status());
        assertEquals(2, updated.priority());
        assertEquals("user", updated.assigneId());
        assertFalse(updated.archived());
    }

    @Test
    void getTasks() {
        //TODO write test
    }
}
