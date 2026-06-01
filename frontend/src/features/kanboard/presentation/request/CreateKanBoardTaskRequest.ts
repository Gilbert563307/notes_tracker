type CreateKanBoardTaskForm = {
  title: string;
  description: string;
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

  getDescription() {
    return this.#data.description;
  }

  validate() {
    if (!this.#kanBoardId) {
      throw new Error("Board id must not be null");
    }
  }
}
