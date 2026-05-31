import React, { useState } from "react";
import { Show } from "../../../../shared/features/show/Show";
import CreateKanBoardTaskForm from "./CreateKanBoardTaskForm";

export default function AddTaskToKanBoardButton({ kanBoardId }: { kanBoardId: string }) {
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setModal(true)}
        className="btn btn-light border-0 w-100 mt-2 text-muted shadow-sm d-flex align-items-center justify-content-center mb-2"
        style={{ backgroundColor: "#eaeded", fontSize: "0.9rem", padding: "8px" }}
      >
        <span className="me-2">+</span> Add item
      </button>

      <Show>
        <Show.When isTrue={modal}>
          <CreateKanBoardTaskForm onClose={() => setModal(false)} kanBoardId={kanBoardId} />
        </Show.When>
      </Show>
    </>
  );
}
