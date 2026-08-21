import React from "react";
import useGetTaskHook from "../../features/kanboard/presentation/hooks/useGetTaskHook";
import SimpleTextEditor from "../../shared/features/texteditor/presentation/components/SimpleTextEditor";
import { Link } from "react-router";
import TaskStatusBadge from "../../features/kanboard/presentation/components/task/TaskStatusBadge";
import "../../features/kanboard/presentation/css/readtaskpage.css";
import "../../features/kanboard/presentation/css/tasktable.css";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";

export default function ReadTaskPage() {
  useSetPageTitleHook({ title: "Tasks" });
  const { task } = useGetTaskHook();

  return (
    <article className="read-task">
      <div className="read-task-title-div">
        <p className="fs-1 task-title">{task.getTitle()}</p>
      </div>
      <div className="read-task-div">
        <div className="read-task-description-parent">
          <div>
            <label htmlFor="description" className="form-label ms-2">
              Description
            </label>
            <SimpleTextEditor content={task.getDescription()} readOnly={true} />
          </div>
        </div>
        <div>
          <div className="read-task-actions">
            <div>{<TaskStatusBadge status={task.getStatus()} />}</div>
            <div>
              <Link to={`/tasks/update/${task.getId()}`} className="notes-tracker-btn notes-tracker-btn-secondary">
                <i className="fa-solid fa-pencil"></i> Change
              </Link>
            </div>
          </div>

          <div className="tasks-deatils-div border rounded">
            <div className="tasks-deatils-div-details-header">
              <h6>Details</h6>
            </div>
            <hr className="bg-body-secondary"></hr>

            <div className="details-table">
              <div className="details-div">
                <p className="fw-medium">Project</p>
                <p>{task.getProjectName()}</p>
              </div>
              <div className="details-div">
                <p className="fw-medium">Assignee</p>
                <p>{task.getAssigneeName()}</p>
              </div>
              <div className="details-div">
                <p className="fw-medium">Reporter</p>
                <p>{task.getReporterName()}</p>
              </div>
            </div>
          </div>

          <div className="d-flex mt-2 border rounded">
            <div className="activity-header">
              <span className="show-header">Show</span>
              <span className="badge dialogic-badge">History</span>
              {/* think bout what to show of the tasks */}
              {/* <span className="badge dialogic-badge">Comments</span> */}
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </article>
  );
}
