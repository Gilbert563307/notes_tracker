import React from "react";
import type { TaskStatus } from "../../domain/Task";

export default function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const statusBadgeMap = {
    ["BACKLOG"]: <span className="badge badge-own rounded-pill badge-backlog">Backlog</span>,
    ["TODO"]: <span className="badge badge-own rounded-pill badge-todo">To do</span>,
    ["DOING"]: <span className="badge badge-own rounded-pill badge-inprogress">In progress</span>,
    ["REVIEW"]: <span className="badge badge-own rounded-pill badge-inprogress">In review</span>,
    ["DONE"]: <span className="badge badge-own rounded-pill  badge-completed">Done</span>,
  };

  return statusBadgeMap[status];
}
