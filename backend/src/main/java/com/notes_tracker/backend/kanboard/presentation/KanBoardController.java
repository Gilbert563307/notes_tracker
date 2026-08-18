package com.notes_tracker.backend.kanboard.presentation;

import com.notes_tracker.backend.kanboard.application.dto.TaskDto;
import com.notes_tracker.backend.kanboard.application.request.AddNewTaskToKanBoard;
import com.notes_tracker.backend.kanboard.application.request.AddTaskToKanBoardRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import com.notes_tracker.backend.kanboard.application.KanBoardService;
import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;

import java.util.List;


@RestController
@RequestMapping("/kanboard")
public class KanBoardController {

    private final KanBoardService kanBoardService;

    public KanBoardController(KanBoardService kanBoardService) {
        this.kanBoardService = kanBoardService;
    }

    @GetMapping
    public ResponseEntity<Page<KanBoardDto>> getBoards(Pageable pageable) {
        return ResponseEntity.ok(kanBoardService.getBoards(pageable));
    }

    @PostMapping
    public ResponseEntity<KanBoardDto> createBoard(@RequestBody KanBoardDto dto) {
        KanBoardDto created = kanBoardService.createBoard(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{boardId}")
    @PreAuthorize("@kanBoardService.isKanBoardOwner(#boardId)")
    public ResponseEntity<KanBoardDto> getBoard(@PathVariable String boardId) {
        return ResponseEntity.ok(kanBoardService.getBoard(boardId));
    }

    @GetMapping("/search")
    @PreAuthorize("@kanBoardService.isKanBoardOwner(#boardId)")
    public  ResponseEntity<List<KanBoardDto>> getKanBoardsBySearchTerm(@RequestParam(required = false) String name, @RequestParam(required = false) String color){
        return  ResponseEntity.ok(this.kanBoardService.getKanBoardsBySearchTerm(name, color));
    }

    @GetMapping("/{boardId}/tasks")
    @PreAuthorize("@kanBoardService.isKanBoardOwner(#boardId)")
    public ResponseEntity<List<TaskDto>> getTasksByKanBoardId(@PathVariable String boardId) {
        return ResponseEntity.ok(kanBoardService.getTasksByKanBoardId(boardId));
    }

    @PatchMapping("/task")
    @PreAuthorize("@kanBoardService.isKanBoardOwner(#boardId)")  //TODO FUTURE THINK ABOUT MULTIPLT PEOPLE ALLOWED TO ADD TASKS IN PROJECT
    public ResponseEntity<List<TaskDto>> addTaskToKanBoard(@RequestBody AddTaskToKanBoardRequest request) {
        return ResponseEntity.ok(kanBoardService.addTaskToKanBoard(request));
    }

    @PatchMapping("/{boardId}/task")
    @PreAuthorize("@kanBoardService.isKanBoardOwner(#boardId)")
    public ResponseEntity<List<TaskDto>> addNewTaskToKanBoard(@RequestBody AddNewTaskToKanBoard request,  @PathVariable String boardId) {
        return ResponseEntity.ok(kanBoardService.addNewTaskToKanBoard(request, boardId));
    }

    @PutMapping
    @PreAuthorize("@kanBoardService.isKanBoardOwner(#dto.id())")
    public ResponseEntity<KanBoardDto> updateBoard(@RequestBody KanBoardDto dto) {
        return ResponseEntity.ok(kanBoardService.updateBoard(dto));
    }

    @DeleteMapping("/{boardId}")
    @PreAuthorize("@kanBoardService.isKanBoardOwner(#boardId)")
    public void deleteBoard(@PathVariable String boardId) {
        kanBoardService.deleteBoard(boardId);
    }
}