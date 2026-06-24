import React, { useState } from "react";
import { Show } from "../../../../shared/features/show/Show";
import CreateKanBoardTaskForm from "./CreateKanBoardTaskForm";
type props = {
  headerId: string;
  createTaskInKanBoard: (data: { title: string; description: string }) => void;
};

export default function CreateCardButton({ headerId, createTaskInKanBoard }: props) {
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <button className="add-card-btn rounded" aria-label={`Add card to ${headerId}`} onClick={() => setModal(true)}>
        <div className="button-card-content">
          <i className="fa-regular fa-plus"></i>
          <span>Add a issue</span>
        </div>
      </button>

      <Show>
        <Show.When isTrue={modal}>
          <CreateKanBoardTaskForm onClose={() => setModal(false)} createTaskInKanBoard={createTaskInKanBoard} />
        </Show.When>
      </Show>
    </>
  );
}
