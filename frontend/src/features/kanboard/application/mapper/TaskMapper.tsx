import { Task, type PageAbleTaskJson, type TaskProps } from "../../domain/Task";
import type { findAllResponse } from "../response/response";

//TODO NEEDS VI TESTING
export class TaskMapper {
  static toTaskList(data: Array<TaskProps>): Task[] {
    if (data.length === 0) return [];
    return data.map((task) => TaskMapper.toTask(task));
  }
  static toTask(task: TaskProps): Task {
    if (!task) {
      throw new Error("No data provided to map");
    }
    return new Task.Builder()
      .id(task.id)
      .title(task.title)
      .description(task.description)
      .status(task.status)
      .priority(task.priority)
      .assigneId(task.assigneId)
      .archived(task.archived)
      .createdAt(task.createdAt)
      .updatedAt(task.updatedAt)
      .build();
  }

  static toPageAbleTask(task: TaskProps) {
    return TaskMapper.toTask(task).toPageAbleTaskJson();
  }

  static toPageAbleTaskListJson(data: findAllResponse<TaskProps>): {
    tasks: Array<TaskProps>;
    totalElements: number;
    totalPages: number;
  } {
    const tasks = data.content.map((task) => TaskMapper.toTask(task));
    const jsonArray = tasks.map((task) => task.toJson());
    return { tasks: jsonArray, totalElements: data.totalElements, totalPages: data.totalPages };
  }

  static toPageAbleTaskList(data: findAllResponse<TaskProps>): {
    tasks: Array<Task>;
    totalElements: number;
    totalPages: number;
  } {
    const tasks = data.content.map((task) => TaskMapper.toTask(task));
    return { tasks: tasks, totalElements: data.totalElements, totalPages: data.totalPages };
  }
}
