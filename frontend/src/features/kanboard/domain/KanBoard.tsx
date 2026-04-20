import type { Task } from "./Task";

type KanBoardProps = {
  id?: string;
  name: string;
  userId: string;
  color?: string;
  archived: boolean;
  collaborative: boolean;
  imageUrl?: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
};

export class KanBoard {
  private id?: string;
  private name: string;
  private userId: string;
  private color?: string;
  private archived: boolean;
  private collaborative: boolean;
  private imageUrl?: string;
  private tasks: Task[];
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(props: KanBoardProps) {
    this.id = props.id;
    this.name = props.name;
    this.userId = props.userId;
    this.color = props.color;
    this.archived = props.archived;
    this.collaborative = props.collaborative;
    this.imageUrl = props.imageUrl;
    this.tasks = props.tasks;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getUserId(): string {
    return this.userId;
  }

  getId(): string | undefined {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getColor(): string | undefined {
    return this.color;
  }

  isArchived(): boolean {
    return this.archived;
  }

  isCollaborative(): boolean {
    return this.collaborative;
  }

  getImageUrl(): string | undefined {
    return this.imageUrl;
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  // assignTask(task: Task): void {
  //   this.tasks.push(task);
  // }

  // removeTask(taskToRemove: Task): void {
  //   this.tasks = this.tasks.filter((task) => task.getId() !== taskToRemove.getId());
  // }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      userId: this.userId,
      color: this.color,
      archived: this.archived,
      collaborative: this.collaborative,
      imageUrl: this.imageUrl,
      tasks: this.tasks.map((task) => task.toJson()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toCreateJson() {
    return {
      name: this.name,
      color: this.color,
      archived: this.archived,
      collaborative: this.collaborative,
      imageUrl: this.imageUrl,
    };
  }

  static from(props: KanBoardProps): KanBoard {
    return new KanBoard.Builder()
      .id(props.id)
      .name(props.name)
      .userId(props.userId)
      .color(props.color)
      .archived(props.archived)
      .collaborative(props.collaborative)
      .imageUrl(props.imageUrl)
      .tasks(props.tasks)
      .createdAt(props.createdAt)
      .updatedAt(props.updatedAt)
      .build();
  }

  static Builder = class {
    #id?: string;
    #name: string = "";
    #userId: string = "";
    #color?: string = "#000000";
    #archived: boolean = false;
    #collaborative: boolean = false;
    #imageUrl?: string;
    #tasks: Task[] = [];
    #createdAt: Date;
    #updatedAt: Date;
    #validate: boolean = true;

    id(id: string): this {
      this.#id = id;
      return this;
    }

    name(name: string): this {
      this.#name = name;
      return this;
    }

    userId(userId: string): this {
      this.#userId = userId;
      return this;
    }

    color(color: string): this {
      this.#color = color;
      return this;
    }

    archived(archived: boolean): this {
      this.#archived = archived;
      return this;
    }

    collaborative(collaborative: boolean): this {
      this.#collaborative = collaborative;
      return this;
    }

    imageUrl(imageUrl: string): this {
      this.#imageUrl = imageUrl;
      return this;
    }

    tasks(tasks: Task[]): this {
      this.#tasks = tasks;
      return this;
    }

    createdAt(date: Date): this {
      this.#createdAt = date;
      return this;
    }

    updatedAt(date: Date): this {
      this.#updatedAt = date;
      return this;
    }

    validate(validate: boolean): this {
      this.#validate = validate;
      return this;
    }

    build(): KanBoard {
      if (this.#archived) {
        if (!this.#name || this.#name.trim().length === 0) {
          throw new Error("Kanboard name is required.");
        }

        if (!this.#userId || this.#userId.trim().length === 0) {
          throw new Error("User ID is required.");
        }

        if (!this.#color?.includes("#")) {
          throw new Error("Kanboard colour is invalid must be of hex code.");
        }
      }

      return new KanBoard({
        id: this.#id,
        name: this.#name,
        userId: this.#userId,
        color: this.#color,
        archived: this.#archived,
        collaborative: this.#collaborative,
        imageUrl: this.#imageUrl,
        tasks: this.#tasks,
        createdAt: this.#createdAt,
        updatedAt: this.#updatedAt,
      });
    }
  };
}
