import { JsonParsingError } from "../../../shared/exceptions/exceptions";
import { OAuth2ResourceService } from "../../../shared/utils/OAuth2ResourceService";
import { RequestHandler } from "../../../shared/utils/RequestHandler";
import type { ApiErrorResponse, DownloadTaskOption } from "../../../types";
import type { Task } from "../domain/Task";
import {
  FailedToDeleteTaskException,
  FailedToFindYourTaskException,
  FailedToUpdateTaskException,
} from "../presentation/exceptions/exceptions";
import { TaskMapper } from "./mapper/TaskMapper";
import type { TaskInformationResponse } from "./response/response";

import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";

//TODO METHODS NEED TESTING
export const TASK_RESOURCE = "task";
export class TaskService extends OAuth2ResourceService {
  constructor(resource: string, requestHandler: RequestHandler) {
    super(resource, requestHandler);
  }

  async getTaskById(id: string): Promise<Task> {
    if (!id) {
      throw new FailedToFindYourTaskException();
    }
    const response = await super.read(id);

    if (!response.ok) {
      const data: ApiErrorResponse = await response.json();
      throw new FailedToFindYourTaskException(data.message);
    }

    try {
      const data: TaskInformationResponse = await response.json();
      const task = TaskMapper.toTask(data.task);
      task.updateProjectName(data.projectName);
      task.updateAssignee(data.assignee);
      task.updateReporter(data.reporter);
      return task;
    } catch (error) {
      throw new JsonParsingError(error?.message);
    }
  }

  async deleteTaskById(taskId: string): Promise<string> {
    if (!taskId) {
      throw new FailedToFindYourTaskException();
    }
    const response = await super.delete(taskId);
    if (!response.ok) {
      throw new FailedToDeleteTaskException();
    }
    return "Your task has been successfully been deleted";
  }

  async updateTask(updateTaskData: Task): Promise<string> {
    if (!updateTaskData.getId()) {
      throw new FailedToFindYourTaskException();
    }
    const response = await super.update(updateTaskData.toJson());
    if (!response.ok) {
      throw new FailedToUpdateTaskException();
    }
    return "Your task has been successfully been updated";
  }

  async downloadTask(description: string | undefined, option: DownloadTaskOption, filename: string) {
    if (option === "Microsoft Word") {
      await this.convertHtmlToDocx({ description: description, filename: filename });
    }

    if (option === "Markdown") {
      this.convertHTMLToMarkdown({ description: description, filename: filename });
    }
  }

  //TODO make a better fix for all this a some resuable class
  protected async convertHTMLToMarkdown(payload: { description: string; filename: string }) {
    const data = new Blob([payload.description], {
      type: "text/markdown",
    }); 

    saveAs(data, this.#convertToValidFilename(payload.filename));
  }

  protected async convertHtmlToDocx(payload: { description: string; filename: string }) {
    const { description, filename } = payload;

    const data = await asBlob(description);
    const correct_filename = this.#convertToValidFilename(filename);
    saveAs(data, correct_filename);
  }

  #convertToValidFilename(string: string) {
    return string.replace(/[\/|\\:*?"<>]/g, " ");
  }
}

const taskService = new TaskService(TASK_RESOURCE, new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL));
export { taskService };
