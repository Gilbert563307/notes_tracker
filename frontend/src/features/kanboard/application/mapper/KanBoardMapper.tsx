import type { getKanBoardsResponse, KanBoardItem } from "../../../auth/types";
import { KanBoard } from "../../domain/KanBoard";
import type { CreateKanBoardRequest } from "../request/CreateKanBoardRequest";

export class KanBoardMapper {
  static findAllResponseToDomain(response: getKanBoardsResponse): {
    total: number;
    pages: number;
    boards: KanBoard[];
  } {
    if (!response) {
      throw new Error("No response to map");
    }
    return {
      total: response.totalElements,
      pages: response.totalPages,
      boards: response.content.map((board) => {
        return KanBoardMapper.toKanBoard(board);
      }),
    };
  }
  static toCreateKanBoardRequest(request: CreateKanBoardRequest) {
    return new KanBoard.Builder().name(request.getName()).color(request.getColor()).id("").build().toCreateJson();
  }

  static toKanBoard(data: KanBoardItem) {
    return new KanBoard.Builder()
      .id(data.id)
      .name(data.name)
      .userId(data.userId)
      .color(data.color)
      .archived(data.archived)
      .collaborative(data.collaborative)
      .imageUrl(data.imageUrl)
      .createdAt(data.createdAt)
      .updatedAt(data.updatedAt)
      .build();
  }
}
