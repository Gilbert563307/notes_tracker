package com.notes_tracker.backend.kanboard.application;

import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import com.notes_tracker.backend.security.application.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class KanBoardService {

    private final KanBoardRepository kanBoardRepository;
    private final UserService userService;

    public KanBoardService(KanBoardRepository kanBoardRepository, UserService userService) {
        this.kanBoardRepository = kanBoardRepository;
        this.userService = userService;
    }

    public Page<KanBoardDto> getBoards(Pageable pageable, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        return kanBoardRepository.findAllByUserId(userId, pageable)
                .map(KanBoardDto::from);
    }

    public KanBoardDto createBoard(KanBoardDto dto, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        KanBoard kanBoardToCreate = new KanBoard.Builder()
                .name(dto.name())
                .userId(userId)
                .color(dto.color())
                .archived(dto.archived())
                .collaborative(dto.collaborative())
                .imageUrl(dto.imageUrl())
                .build();
        KanBoard board = kanBoardRepository.save(kanBoardToCreate);
        return KanBoardDto.from(board);
    }

    public KanBoardDto getBoard(String boardId, Authentication authentication) {
        KanBoard board = getBoardById(boardId, authentication);
        return KanBoardDto.from(board);
    }

    private KanBoard getBoardById(String boardId, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        KanBoard kanBoard = kanBoardRepository.findKanBoardByIdAndUserId(boardId, userId);
        if (kanBoard == null) {
            throw new ResourceNotFoundException("KanBoard not found");
        }
        return kanBoard;
    }

    private String getCurrentAuthenticatedUserId(Authentication authentication) {
        return this.userService.getUserIdByDisplayName(authentication.getName());
    }

    public KanBoardDto updateBoard(KanBoardDto dto, Authentication authentication) {
        KanBoard board = getBoardById(dto.id(), authentication);

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

    public void deleteBoard(String boardId, Authentication authentication) {
        String userId = this.getCurrentAuthenticatedUserId(authentication);
        kanBoardRepository.deleteKanBoardByIdAndUserId(boardId,userId);
    }
}