package com.notes_tracker.backend.kanboard.presentation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.notes_tracker.backend.kanboard.application.KanBoardService;
import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;

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
    public ResponseEntity<KanBoardDto> getBoard(@PathVariable String boardId) {
        return ResponseEntity.ok(kanBoardService.getBoard(boardId));
    }

    @PutMapping
    public ResponseEntity<KanBoardDto> updateBoard(@RequestBody KanBoardDto dto) {
        return ResponseEntity.ok(kanBoardService.updateBoard(dto));
    }

    @DeleteMapping("/{boardId}")
    public void deleteBoard(@PathVariable String boardId) {
        kanBoardService.deleteBoard(boardId);
    }
}