package com.notes_tracker.backend.kanboard.application;

import java.util.List;

import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.application.request.AddTaskToKanBoardRequest;
import com.notes_tracker.backend.kanboard.data.TaskRepository;
import com.notes_tracker.backend.kanboard.domain.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import com.notes_tracker.backend.security.application.UserService;

@Service
public class KanBoardService {

    private final KanBoardRepository kanBoardRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    

    public KanBoardService(KanBoardRepository kanBoardRepository, TaskRepository taskRepository, UserService userService) {
        this.kanBoardRepository = kanBoardRepository;
        this.taskRepository = taskRepository;
        this.userService = userService;
    }

    public Page<KanBoardDto> getBoards(Pageable pageable) {
        String userId = this.userService.getUserIdByAuthentication();
        return kanBoardRepository.findAllByUserId(userId, pageable)
                .map(KanBoardDto::from);
    }

    public KanBoardDto createBoard(KanBoardDto dto) {
        String userId = this.userService.getUserIdByAuthentication();
        long totalKanBoards = this.kanBoardRepository.countByUserId(userId);
        KanBoard kanBoardToCreate = new KanBoard.Builder()
                .name(dto.name())
                .userId(userId)
                .color(dto.color())
                .archived(dto.archived())
                .collaborative(dto.collaborative())
                .imageUrl(dto.imageUrl())
                .totalKanBoards(totalKanBoards)
                .build();
        KanBoard board = kanBoardRepository.save(kanBoardToCreate);
        return KanBoardDto.from(board);
    }

    public KanBoardDto getBoard(String boardId) {
        KanBoard board = getBoardById(boardId);
        return KanBoardDto.from(board);
    }

    private KanBoard getBoardById(String boardId) {
        KanBoard kanBoard = kanBoardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("KanBoard not found"));
        return kanBoard;
    }


    public KanBoardDto updateBoard(KanBoardDto dto) {
        KanBoard board = getBoardById(dto.id());
        board.update(
                dto.name(),
                dto.userId(),
                dto.color(),
                dto.archived(),
                dto.collaborative(),
                dto.imageUrl()
        );

        kanBoardRepository.save(board);
        return KanBoardDto.from(board);
    }

    public void deleteBoard(String boardId) {
        kanBoardRepository.deleteById(boardId);
    }

    public void deleteByIdIn(List<String> ids){
        String userId = this.userService.getUserIdByAuthentication();
        this.kanBoardRepository.deleteByIdInAndUserId(ids, userId);
    }

    public boolean isKanBoardOwner(final String id) {
        final String userId = this.userService.getUserIdByAuthentication();
        final KanBoard kanBoard = this.kanBoardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kanboard not found"));
        //does drive file equal to current auth user
        return kanBoard.getUserId().equals(userId);
    }

    public List<TaskDto> getTasksByKanBoardId(String boardId) {
        KanBoard board = getBoardById(boardId);
        return TaskDto.fromRawTaskList(board.getTasks());
    }

    public List<TaskDto> addTaskToKanBoard(AddTaskToKanBoardRequest request) {
        if(request.taskId() == null || request.taskId().isEmpty()) {
            throw new ResourceNotFoundException("Unable to assign the task to the specified Kanban board. The task ID may be missing or invalid.");
        }
        KanBoard board = getBoardById(request.kanBoardId());
        Task task = this.taskRepository.findById(request.taskId())
                .orElseThrow(() -> new ResourceNotFoundException( "Task not found. No task exists with the provided ID: " + request.taskId()));
        board.assignTask(task);
        KanBoard saved = this.kanBoardRepository.save(board);
        return TaskDto.fromRawTaskList(saved.getTasks());
    }
}