import { TaskService, taskService } from "../application/TaskService";

export class TaskController {
  #taskService: TaskService;

  constructor(taskService: TaskService) {
    this.#taskService = taskService;
  }
}

const taskController = new TaskController(taskService);
export { taskController };
