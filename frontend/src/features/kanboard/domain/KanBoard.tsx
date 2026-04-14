// Assuming Task and DomainException exist
import { Task } from "./Task";

export class KanBoard {
  id?: string;
  private name: string;
  private userId: string;
  private color?: string;
  private archived: boolean;
  private collaborative: boolean;
  private imageUrl?: string;
  private tasks: Task[];
  private createdAt: Date;
  private updatedAt: Date;

  constructor() {
    this.name = builder.name;
    this.userId = builder.userId;
    this.color = builder.color;
    this.archived = builder.archived;
    this.collaborative = builder.collaborative;
    this.imageUrl = builder.imageUrl;
    this.tasks = builder.tasks;
    this.createdAt = builder.createdAt;
    this.updatedAt = builder.updatedAt;
    this.validate();
  }

  update(name: string, userId: string, color: string, archived: boolean, collaborative: boolean, imageUrl: string) {
    this.name = name;
    this.userId = userId;
    this.color = color;
    this.archived = archived;
    this.collaborative = collaborative;
    this.imageUrl = imageUrl;
    this.updatedAt = new Date();
    this.validate();
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

  assignTask(task: Task): void {
    this.tasks.push(task);
  }

  removeTask(taskToRemove: Task): void {
    this.tasks = this.tasks.filter((task) => task.getId() !== taskToRemove.getId());
  }

  
  /**
   * Description placeholder
   * @type {Builder}
   * @class 
   */
  static Builder = class {
    #name: string;
    #userId: string;
    #color: string;
    #archived: boolean = false;
    #collaborative: boolean = false;
    #imageUrl: string;
    #tasks: Task[] = [];
    #createdAt: Date = new Date();
    #updatedAt: Date = new Date();

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
    build(): KanBoard {
      return new KanBoard({
            name: this.#name,
            userId: this.#userId,
            color: this.#color,
            archived: this.#archived,
            name: this.#name,
            name: this.#name,
            name: this.#name,
            name: this.#name,
      });
    }
  };

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Board name is required.");
    }

    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error("User ID is required.");
    }
  }
}

