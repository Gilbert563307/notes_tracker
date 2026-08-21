import React, { useRef } from "react";
import type { TaskStatus } from "../../../domain/Task";
import { TASKS_STATUS } from "../../../../../config/config";
import "../../css/statusbuttoncomponent.css";

export default function StatusButtonComponent({
  taskStatus,
  callBackFn,
}: {
  taskStatus: TaskStatus;
  callBackFn: (v: TaskStatus) => void;
}) {
  const statusDropDownRef = useRef<HTMLButtonElement>();

  function toggleSelectedStatusDropDownItem(s: TaskStatus) {
    callBackFn(s);
    statusDropDownRef.current.click();
  }

  const statusDropDownItems = [
    { content: TASKS_STATUS.BACKLOG, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.BACKLOG) },
    { content: TASKS_STATUS.TODO, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.TODO) },
    { content: TASKS_STATUS.DOING, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.DOING) },
    { content: TASKS_STATUS.REVIEW, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.REVIEW) },
    { content: TASKS_STATUS.DONE, onclick: () => toggleSelectedStatusDropDownItem(TASKS_STATUS.DONE) },
  ];

  // Class for the parent button to reflect the current task status
  const statusParentBtnStatus = `selected-status-item-${taskStatus}`;

  function formatText(status: string): string {
    const lowerStr = status.toLowerCase();
    return lowerStr.charAt(0).toLocaleUpperCase() + lowerStr.slice(1);
  }

  return (
    <div className="dropdown">
      <button
        className={`notes-tracker-btn notes-tracker-badge ${statusParentBtnStatus} dropdown-toggle`}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        ref={statusDropDownRef}
      >
        {formatText(taskStatus)}
      </button>
      <ul className="dropdown-menu">
        {statusDropDownItems.map((statusItem, index) => (
          <li key={index}>
            <button className="dropdown-item" type="button" onClick={statusItem.onclick}>
              {formatText(statusItem.content)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
