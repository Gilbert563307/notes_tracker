package com.notes_tracker.backend.application;


import com.notes_tracker.backend.kanboard.application.KanBoardService;
import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.application.request.AddNewTaskToKanBoard;
import com.notes_tracker.backend.kanboard.application.request.AddTaskToKanBoardRequest;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
import com.notes_tracker.backend.kanboard.domain.Task;
import com.notes_tracker.backend.security.application.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class KanBoardServiceTests {
    private final KanBoardRepository kanBoardRepository = mock(KanBoardRepository.class);
    private final UserService userService = mock(UserService.class);
    private final TaskRepository taskRepository = mock(TaskRepository.class);
    private final KanBoardService service = new KanBoardService(this.kanBoardRepository,taskRepository, userService);


    @BeforeEach
    void init(){
        when(userService.getUserIdByAuthentication()).thenReturn("user-1");
    }

    @Test
    void createBoard() {

        KanBoard board = new KanBoard.Builder()
                .name("Board")
                .userId("user-1")
                .build();

        when(this.kanBoardRepository.save(any())).thenReturn(board);
        KanBoardDto result = this.service.createBoard(KanBoardDto.from(board));

        assertEquals("Board", result.name());
    }

    @Test
    void updateBoard() {
        KanBoard board = new KanBoard.Builder()
                .name("Old")
                .userId("user")
                .build();

        when(kanBoardRepository.findById("1")).thenReturn(Optional.of(board));
        when(kanBoardRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        KanBoardDto updated = service.updateBoard(
                new KanBoardDto(
                        "1",
                        "Board",
                        "user-1",
                        "#11211",
                        false,
                        true,
                        "img.png",
                        null,
                        null
                )
        );

        assertEquals("Board", updated.name());
        assertEquals("user-1", updated.userId());
        assertEquals("#11211", updated.color());
        assertTrue(updated.collaborative());
        assertEquals("img.png", updated.imageUrl());
        assertFalse(updated.archived());
    }

    @Test
    void getTasksByKanBoardId(){
        Task task = new Task.Builder()
                .title("Test")
                .userId("user-1")
                .build();

        Task task2 = new Task.Builder()
                .title("Test2")
                .userId("user-1")
                .build();

        Task task3 = new Task.Builder()
                .title("Test")
                .userId("user-1")
                .build();


        when(this.taskRepository.saveAll(List.of(task, task2, task3))).thenReturn(List.of(task, task2, task3));
        List<Task> savedTasks = this.taskRepository.saveAll(List.of(task, task2, task3));

        KanBoard board = new KanBoard.Builder()
                .name("Old")
                .userId("user")
                .tasks(savedTasks)
                .build();

        when(this.kanBoardRepository.findById("1")).thenReturn(Optional.ofNullable(board));
        List<TaskDto> taskDtos = this.service.getTasksByKanBoardId("1");

        verify(this.taskRepository).saveAll(List.of(task, task2, task3));

        verify(this.kanBoardRepository).findById("1");

        assertNotNull(taskDtos);
        assertEquals(3, taskDtos.size());
    }

    @Test
    void addTaskToKanBoard(){
        //arrange
        Task task = new Task.Builder()
                .title("Test")
                .userId("user-1")
                .build();

        when(this.taskRepository.findById("1")).thenReturn(Optional.ofNullable(task));

        KanBoard board = new KanBoard.Builder()
                .name("Old")
                .userId("user")
                .build();

        when(this.kanBoardRepository.findById("1")).thenReturn(Optional.ofNullable(board));

        when(this.kanBoardRepository.save(board)).thenReturn(board);
        List<TaskDto> taskDtoList = this.service.addTaskToKanBoard(
                new AddTaskToKanBoardRequest("1", "1")
        );
        //assert
        verify(this.taskRepository).findById("1");
        verify(this.kanBoardRepository).findById("1");
        verify(this.kanBoardRepository).save(board);
        assertNotNull(taskDtoList);
        assertEquals(1, taskDtoList.size());
    }

    @Test
    void addNewTaskToKanBoard(){
        KanBoard board = new KanBoard.Builder()
                .name("Old")
                .userId("user")
                .build();

        TaskDto taskDto = new TaskDto(
                null,
                "Task A",
                "desc",
                Task.TaskStatus.TODO,
                1,
                "user-1",
                false,
                null,
                null
        );

        when(this.kanBoardRepository.findById("1")).thenReturn(Optional.ofNullable(board));

        when(this.kanBoardRepository.save(board)).thenReturn(board);

        List<TaskDto> taskDtoList = this.service.addNewTaskToKanBoard(
                new AddNewTaskToKanBoard(taskDto), "1"
        );
        //assert

        verify(this.kanBoardRepository).findById("1");
        verify(this.kanBoardRepository).save(board);
        assertNotNull(taskDtoList);
        assertEquals(1, taskDtoList.size());

    }

    @Test
    void getKanBoardsBySearchTerm() throws Exception {
        KanBoard board = new KanBoard.Builder()
                .name("Old")
                .userId("user")
                .build();

        Optional<List<KanBoard>> results = Optional.of(List.of(board));

        when(this.kanBoardRepository.findKanBoardByNameContainingAndColorContaining("name", "")).thenReturn(results);

        List<KanBoardDto> serviceResults = this.service.getKanBoardsBySearchTerm("name", "");

        verify(this.kanBoardRepository).findKanBoardByNameContainingAndColorContaining("name", "");

        //assert
        assertNotNull(results);
        assertEquals(1, serviceResults.size());
    }

}