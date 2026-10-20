import React, { useState } from "react";
import type { TaskProps } from "../../../domain/Task";
import { Modal } from "antd";

export default function ArchiveTaskButton({
  task,
  archiveTask,
}: {
  task: TaskProps;
  archiveTask: (taskProps: TaskProps) => void;
}) {
  const [modal, setModal] = useState(false);

  const modalContent = task.archived ? (
    <p>Restoring this task will move it back to your active task list. You can archive it again later if needed.</p>
  ) : (
    <p>
      Archiving will move the task to the archive and it will no longer be visible in your active task list. You can
      restore it from the archive later if needed.
    </p>
  );

  const modalTitle = task.archived
    ? "Are you sure you want to restore this task ?"
    : "Are you sure you want to archive this task ?";

  async function handleOk() {
    archiveTask(task);
    setModal(false);
  }

  function handleCancel() {
    setModal(false);
  }
  return (
    <React.Fragment>
      <button onClick={() => setModal(true)}>
        <i className="fa-solid fa-box-archive"></i>
      </button>

      <Modal
        title={modalTitle}
        closable={{ "aria-label": "Custom Close Button" }}
        open={modal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {modalContent}
      </Modal>
    </React.Fragment>
  );
}
