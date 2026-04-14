import React from "react";

export default function CreateKanBoardPage() {
  function onSubmit(data: { name: string; color: string }) {}

  return (
    <KanboardForm
      onSubmit={onSubmit}
      board={new KanBoardDto(null, null, null, null, null, null, null, null)}
      submitButtonValue="create"
    />
  );
}
