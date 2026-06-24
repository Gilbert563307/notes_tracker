import React, { useState } from "react";
import { Show } from "../../../../shared/features/show/Show";
import BS5Modal, { MODAL_SIZES } from "../../../../shared/features/bs5/presentation/components/BS5Modal";

export default function DeleteKanBoardButton({
  kanBoardId,
  deleteKanBoard,
}: {
  kanBoardId: string | undefined;
  deleteKanBoard: () => void;
}) {
  const [deleteModal, setDeleteModal] = useState(false);

  if (!kanBoardId) return "";

  function showModal() {
    setDeleteModal(true);
  }

  function hideModal() {
    setDeleteModal(false);
  }

  async function deleteKanBoardButton() {
    await deleteKanBoard();
    hideModal();
  }

  const modalContent = (
    <p>
      Deleting this kanboard will permanently remove it from your kanboard's list, and it cannot be restored later.
      Please confirm if you wish to proceed with this permanent deletion.
    </p>
  );

  return (
    <React.Fragment>
      <button onClick={showModal} type="button" className="notes-tracker-btn notes-tracker-btn-secondary">
        Delete kanboard
      </button>
      <Show>
        <Show.When isTrue={deleteModal}>
          <BS5Modal
            modal_id="delete_kanboard_modal"
            modal_label="delete_kanboard_modal"
            modal_title="Are you sure you want to delete this kan board?"
            modal_content={modalContent}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            closeModal={hideModal}
            saveChangesFunction={deleteKanBoardButton}
            modalSize={MODAL_SIZES.NONE}
            saveChangesTitle="Delete"
            saveChangesClass={4}
          />
        </Show.When>
      </Show>
    </React.Fragment>
  );
}
