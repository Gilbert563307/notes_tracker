import React from "react";
import { KanBoard } from "../../features/kanboard/domain/KanBoard";
import KanBoardForm from "../../features/kanboard/presentation/components/KanBoardForm";
import { kanBoardController } from "../../features/kanboard/presentation/KanBoardController";
import { CreateKanBoardRequest } from "../../features/kanboard/application/request/CreateKanBoardRequest";

export default function CreateKanBoardPage() {
  async function onSubmit(data: { name: string; color: string }) {
    const response = await kanBoardController.createKanBoard(new CreateKanBoardRequest(data.name, data.color));
  }

  return (
    <KanBoardForm
      onSubmit={onSubmit}
      board={new KanBoard.Builder().validate(false).build()}
      submitButtonValue="create"
    />
  );
}
