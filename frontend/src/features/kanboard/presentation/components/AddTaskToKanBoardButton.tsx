import React, { useState } from "react";
import { Show } from "../../../../shared/features/show/Show";
import CreateKanBoardTaskForm from "./CreateKanBoardTaskForm";

export default function AddTaskToKanBoardButton({ kanBoardName }: { kanBoardName: string }) {
  const [modal, setModal] = useState<boolean>(false);
  const modalTitle = `Create new issue in ${kanBoardName}`;

  function addTaskToKanBoard() {}
  return (
    <>
      <button
        onClick={() => setModal(true)}
        className="btn btn-light border-0 w-100 mt-2 text-muted shadow-sm d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#eaeded", fontSize: "0.9rem", padding: "8px" }}
      >
        <span className="me-2">+</span> Add item
      </button>

      <Show>
        <Show.When isTrue={modal}>
          <CreateKanBoardTaskForm onClose={() => setModal(false)} />
        </Show.When>
      </Show>
    </>
  );
}
