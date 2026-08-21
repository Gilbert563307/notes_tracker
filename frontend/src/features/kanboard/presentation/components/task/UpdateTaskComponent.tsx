import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Task, type TaskStatus } from "../../../domain/Task";
import QuilTextEditor from "../../../../../shared/features/texteditor/presentation/components/QuilTextEditor";
import "../../css/updatetaskcomponent.css";
import DeleteTaskButton from "../DeleteTaskButton";
import TaskDetails from "./TaskDetails";
import DownloadTaskButton from "./DownloadTaskButton";
import type { DownloadTaskOption } from "../../../../../types";
import { taskController } from "../../TaskController";

type props = {
  task: Task;
  deleteTask: () => void;
  updateTask: (t: Task) => void;
};

export type customFieldsType = {
  status: TaskStatus;
  priority: number;
  description: string;
};

export default function UpdateTaskComponent({ task, deleteTask, updateTask }: props) {
  const [customFields, setCustomFields] = useState<customFieldsType>({
    status: "BACKLOG",
    priority: 0,
    description: "",
  });

  function handleCustomFieldChange(field: "status" | "priority" | "description", value: TaskStatus | number | string) {
    setCustomFields((prevFields) => ({ ...prevFields, [field]: value }));
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  async function onSubmit(data: { title: string }) {
    const { title } = data;

    const updatedTask = new Task.Builder()
      .id(task.getId())
      .projectId(task.getProjectId())
      .title(title)
      .description(customFields.description)
      .status(customFields.status)
      .priority(customFields.priority)
      .assigneId(task.getAssigneId())
      .archived(task.isArchived())
      .createdAt(task.getCreatedAt())
      .updatedAt(task.getUpdatedAt())
      .build();
    await updateTask(updatedTask);
  }

  async function downloadTask(option: DownloadTaskOption) {
    await taskController.downloadTask(task.getDescription(), option, task.getTaskAsFileName());
  }

  useEffect(() => {
    reset({
      title: task.getTitle(),
    });
    setCustomFields({
      status: task.getStatus(),
      priority: task?.getPriority(),
      description: task?.getDescription(),
    });
  }, [task]);

  return (
    <div>
      <form>
        <article className="read-task">
          <div className="read-task-title-div update-task-title-div">
            <input
              className={`form-control fs-1 task-title update-task-title ${errors.title ? "is-invalid" : ""}`}
              maxLength={255}
              {...register("title", {
                required: "The title cannot be empty",

                minLength: {
                  value: 4,
                  message: "The title must be longer than 4 characters",
                },
                maxLength: {
                  value: 255,
                  message: "The title cannot be longer than 255 characters",
                },
              })}
            />
            {errors.title && <div className="invalid-feedback d-block">{errors.title.message}</div>}
          </div>
          <div className="read-task-div">
            <div className="read-task-description-parent">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <QuilTextEditor
                content={customFields.description}
                saveText={(value) => handleCustomFieldChange("description", value)}
              />
              {errors.description && <div className="invalid-feedback d-block">{errors.description.message}</div>}
            </div>
            <div className="update-task-grid-2">
              <div className="update-task-grid-buttons">
                <div className="options-buttons">
                  <div className="options-first-div">
                    <button
                      type="submit"
                      className="notes-tracker-btn notes-tracker-btn-primary"
                      name="save"
                      onClick={handleSubmit(onSubmit)}
                    >
                      <i className="fa-regular fa-floppy-disk"></i> Save
                    </button>

                    <DownloadTaskButton downloadTask={downloadTask} />
                  </div>

                  <DeleteTaskButton deleteTask={deleteTask} />
                </div>
                <TaskDetails
                  task={task}
                  customFields={customFields}
                  setStatus={(value) => handleCustomFieldChange("status", value)}
                  setPriority={(value) => handleCustomFieldChange("priority", value)}
                />
              </div>
            </div>
          </div>
        </article>
      </form>
    </div>
  );
}
