import React from "react";
import type { Task } from "../../../domain/Task";
import type { customFieldsType } from "./UpdateTaskComponent";
import StatusButtonComponent from "./StatusButtonComponent";
import PriorityButtonComponent from "./PriorityButtonComponent";

type TaskDetailsProps = {
  task: Task;
  customFields: customFieldsType;
  setStatus: (v: string) => void;
  setPriority: (v: number) => void;
};

export default function TaskDetails({ task, customFields, setStatus, setPriority }: TaskDetailsProps) {
  return (
    <div className="tasks-deatils-div border rounded">
      <div className="tasks-deatils-div-details-header">
        <h6>Details</h6>
      </div>
      <hr className="bg-body-secondary"></hr>
      <div className="details-table">
        <div className="details-div">
          <p className="fw-medium">Project</p>
          <p>{task?.getProjectName()}</p>
        </div>
        <div className="details-div">
          <p className="fw-medium">Assignee</p>
          <p>{task?.getAssigneeName()}</p>
        </div>
        <div className="details-div">
          <p className="fw-medium">Reporter</p>
          <p>{task?.getReporterName()}</p>
        </div>
        <div className="details-div">
          <p className="fw-medium">Status</p>
          <StatusButtonComponent taskStatus={customFields?.status} callBackFn={setStatus} />
        </div>
        <div className="details-div">
          <p className="fw-medium">Priority</p>
          <PriorityButtonComponent priorityStatus={customFields?.priority} callBackFn={setPriority} />
        </div>
      </div>
    </div>
  );
}
