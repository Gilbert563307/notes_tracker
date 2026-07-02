import type { TaskStatus } from "../../domain/Task";

type CreateKanBoardTaskForm = {
  title: string;
  description: string;
  status: TaskStatus;
};

export class CreateKanBoardTaskRequest {
  #data: CreateKanBoardTaskForm;
  #kanBoardId: string;

  constructor(data: CreateKanBoardTaskForm, kanBoardId: string) {
    this.#data = data;
    this.#kanBoardId = kanBoardId;
  }

  getKanBoardId() {
    return this.#kanBoardId;
  }

  toJson() {
    return this.#data;
  }

  getTitle() {
    return this.#data.title;
  }

  getStatus() {
    return this.#data.status;
  }

  getDescription() {
    return this.#data.description;
  }

  validate() {
    if (!this.#kanBoardId) {
      throw new Error("Board id must not be null");
    }
  }
}
