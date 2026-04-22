import { KanBoard } from "../../domain/KanBoard";
import type { CreateKanBoardRequest } from "../request/CreateKanBoardRequest";

export class KanBoardMapper {
  static toCreateKanBoardRequest(request: CreateKanBoardRequest) {
    return new KanBoard.Builder().name(request.getName()).color(request.getColor()).id("").build().toCreateJson();
  }
}
