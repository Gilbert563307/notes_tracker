import React, { useState } from "react";
import { Show } from "../../../../../shared/features/show/Show";
import BS5Modal from "../../../../../shared/features/bs5/presentation/components/BS5Modal";
import type { DownloadTaskOption } from "../../../../../types";

export default function DownloadTaskButton({ downloadTask }: { downloadTask: (p: DownloadTaskOption) => void }) {
  const [modal, setModal] = useState(false);

  const modalContent = (
    <ul>
      <li>
        <a className="link" href="#" onClick={() => downloadTask("Markdown")}>
          Markdown{" "}
        </a>
      </li>
      <li>
        <a className="link" href="#" onClick={() => downloadTask("Microsoft Word")}>
          Microsoft Word
        </a>
      </li>
      <li>
        <a className="link" href="#" onClick={() => downloadTask("PDF")}>
          PDF
        </a>
      </li>
    </ul>
  );

  return (
    <div>
      <button
        type="button"
        className="notes-tracker-btn notes-tracker-btn-secondary"
        name="save"
        onClick={() => setModal(true)}
      >
        <i className="fa-solid fa-download"></i> Download
      </button>

      <Show>
        <Show.When isTrue={modal}>
          <BS5Modal
            modal_id="delete_tasks_modal"
            modal_label="delete_tasks_modal"
            modal_title="Choose your download options"
            modal_content={modalContent}
            showSaveChanges={true}
            modal_footer={false}
            headerCentre={true}
            closeModal={() => setModal(false)}
          />
        </Show.When>
      </Show>
    </div>
  );
}
