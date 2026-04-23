import { Task, type TaskProps } from "../../domain/Task";

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
}
