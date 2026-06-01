import type { TaskStatus } from "../../domain/Task";

export class CreateTaskRequest {
  #title: string;
  #description: string;
  #status: TaskStatus;
  #priority: number;
  #assigneId: string;
  #archived: boolean;

  private constructor(
    title: string,
    description: string,
    status: TaskStatus,
    priority: number,
    assigneId: string,
    archived: boolean,
  ) {
    this.#title = title;
    this.#description = description;
    this.#status = status;
    this.#priority = priority;
    this.#assigneId = assigneId;
    this.#archived = archived;
  }

  static Builder = class {
    #title: string;
    #description!: string;
    #status: TaskStatus = "TODO";
    #priority: number = 0;
    #assigneId: string = "";
    #archived: boolean = false;

    title(title: string) {
      this.#title = title;
      return this;
    }

    description(description: string) {
      this.#description = description;
      return this;
    }

    status(status: TaskStatus) {
      this.#status = status;
      return this;
    }

    priority(priority: number) {
      this.#priority = priority;
      return this;
    }

    assigneId(assigneId: string) {
      this.#assigneId = assigneId;
      return this;
    }

    archived(archived: boolean) {
      this.#archived = archived;
      return this;
    }

    build(): CreateTaskRequest {
      if (!this.#title) throw new Error("Title is required");
      if (!this.#description) throw new Error("Description is required");
      if (!this.#status) throw new Error("Status is required");

      return new CreateTaskRequest(
        this.#title,
        this.#description,
        this.#status,
        this.#priority,
        this.#assigneId,
        this.#archived,
      );
    }
  };

  toJson() {
    return {
      task: {
        title: this.#title,
        description: this.#description,
        status: this.#status,
        priority: this.#priority,
        assigneId: this.#assigneId,
        archived: this.#archived,
      },
    };
  }
}
