import type { TaskProps } from "../../domain/Task";

export type TaskInformationResponse = {
  task: TaskProps;
  projectName: string;
  assignee: string;
  reporter: string;
};