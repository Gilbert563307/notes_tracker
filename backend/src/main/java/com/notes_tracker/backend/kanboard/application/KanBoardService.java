package com.notes_tracker.backend.kanboard.application;

import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class KanBoardService {

    private final KanBoardRepository kanBoardRepository;

    public KanBoardService(KanBoardRepository kanBoardRepository) {
        this.kanBoardRepository = kanBoardRepository;
    }

    public Page<KanBoardDto> getBoards(Pageable pageable) {
        return kanBoardRepository.findAll(pageable)
                .map(KanBoardDto::from);
    }

    public KanBoardDto createBoard(KanBoardDto dto) {
        KanBoard board = kanBoardRepository.save(dto.toDomain());
        return KanBoardDto.from(board);
    }

    public KanBoardDto getBoard(String boardId) {
        KanBoard board = getBoardById(boardId);
        return KanBoardDto.from(board);
    }

    private KanBoard getBoardById(String boardId) {
        return kanBoardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("KanBoard not found"));
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
}