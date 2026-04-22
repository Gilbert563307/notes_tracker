import React, { useState } from "react";
import { Show } from "../../../../shared/features/show/Show";

export default function DeleteKanBoardButton({kanBoardId}: string) {
  const [deleteModal, setDeleteModal] = useState(false);

  const showModal = () => {
    setDeleteModal(true);
  };

  const hideModal = () => {
    setDeleteModal(false);
  };

  const deleteFolder = () => {
    // dispatch({ type: KAN_BOARDS_CONTROLLER_ACTIONS.DELETE, payload: kanBoardId });
    hideModal();
  };

  const modalContent = (
    <p>
      Deleting this kanboard will permanently remove it from your kanboard's list, and it cannot be restored later.
      Please confirm if you wish to proceed with this permanent deletion.
    </p>
  );

  return (
    <React.Fragment>
      <button onClick={showModal} type="button" className="btn btn-outline-danger delete-btn-plain">
        Delete kanboard
      </button>
      <Show>
        <Show.When isTrue={deleteModal}>
          {/* <BS5Modal
            modal_id="delete_kanboard_modal"
            modal_label="delete_kanboard_modal"
            modal_title="Are you sure you want to delete this kan board?"
            modal_content={modalContent}
            showSaveChanges={true}
            modal_footer={true}
            headerCentre={true}
            closeModal={hideModal}
            saveChangesFunction={deleteFolder}
            modalSize={MODAL_SIZES.NONE}
            saveChangesTitle="Delete"
            saveChangesClass={4}
          /> */}
        </Show.When>
      </Show>
    </React.Fragment>
  );
}
