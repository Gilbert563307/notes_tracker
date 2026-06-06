import React from "react";
import KanBoardForm from "../../features/kanboard/presentation/components/KanBoardForm";

import useGetKanBoardByIdHook from "../../features/kanboard/presentation/hooks/useGetKanBoardByIdHook";

export default function UpdateKanBoardPage() {
  const { kanBoard } = useGetKanBoardByIdHook();

  async function onSubmit(data: { name: string; color: string }) {
    console.log(data);
  }

  if (kanBoard === undefined) {
    return <p>Loading KanBoard details...</p>;
  }

  return <KanBoardForm onSubmit={onSubmit} board={kanBoard} submitButtonValue="Save changes" />;
}
