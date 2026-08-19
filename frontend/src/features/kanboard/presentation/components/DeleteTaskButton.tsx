import React, { useState } from "react";
import { Show } from "../../../../shared/features/show/Show";
import BS5Modal, { MODAL_SIZES } from "../../../../shared/features/bs5/presentation/components/BS5Modal";

export default function DeleteTaskButton({ deleteTask }: { deleteTask: () => void }) {
  const [modal, setModal] = useState(false);

  const modalContent = (
    <p>
      {" "}
      Deleting this task will permanently remove it from your task list, and it cannot be restored later. Please confirm
      if you wish to proceed with this permanent deletion.
    </p>
  );

  async function deleteTaskMethod() {
    await deleteTask();
    setModal(false);
  }
  return (
    <div>
      <button onClick={() => setModal(true)} type="button" className="notes-tracker-btn notes-tracker-btn-danger">
        Delete task
      </button>
      <Show>
        <Show.When isTrue={modal}>
          <BS5Modal
            modal_id="delete_tasks_modal"
            modal_label="delete_tasks_modal"
            modal_title="Are you sure you want to delete this task?"
            modal_content={modalContent}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            closeModal={() => setModal(false)}
            saveChangesFunction={deleteTaskMethod}
            modalSize={MODAL_SIZES.NONE}
            saveChangesTitle="Delete"
            saveChangesClass={4}
          />
        </Show.When>
      </Show>
    </div>
  );
}
