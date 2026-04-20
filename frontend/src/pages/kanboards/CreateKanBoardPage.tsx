import React from "react";
import { KanBoard } from "../../features/kanboard/domain/KanBoard";
import KanBoardForm from "../../features/kanboard/presentation/components/KanBoardForm";

export default function CreateKanBoardPage() {
  function onSubmit(data: { name: string; color: string }) {}
  
  return (
    <KanBoardForm
      onSubmit={onSubmit}
      board={new KanBoard.Builder().build()}
      submitButtonValue="create"
    />
  );
}
