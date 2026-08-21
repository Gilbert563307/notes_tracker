import React from "react";
import { TASKS_STATUS } from "../../../../../config/config";
import type { TaskStatus } from "../../../domain/Task";

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const statusBadgeMap = {
    [TASKS_STATUS.BACKLOG]: <span className="badge badge-own rounded-pill badge-backlog">Backlog</span>,
    [TASKS_STATUS.TODO]: <span className="badge badge-own rounded-pill badge-todo">To do</span>,
    [TASKS_STATUS.DOING]: <span className="badge badge-own  rounded-pill badge-inprogress">Doing</span>,
    [TASKS_STATUS.REVIEW]: <span className="badge badge-own  rounded-pill badge-review">Review</span>,
    [TASKS_STATUS.DONE]: <span className="badge badge-own rounded-pill  badge-completed">Done</span>,
  };

  return statusBadgeMap[status];
}
