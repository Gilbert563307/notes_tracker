export type TaskStatus = "BACKLOG" | "TODO" | "DOING" | "REVIEW" | "DONE";

export type TaskProps = {
  id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: number;
  assigneId?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export class Task {
  public static MIN_TITLE_LENGTH = 4;

  private id?: string;
  private title: string;
  private description?: string;
  private status: TaskStatus;
  private priority: number;
  private assigneId?: string;
  private archived: boolean;

  //these come from the api
  private projectName: string;
  private reporterName: string;
  private assigneeName: string;

  private createdAt: string;
  private updatedAt: string;

  private constructor({
    id,
    title,
    status,
    description,
    priority,
    assigneId,
    archived,
    createdAt,
    updatedAt,
  }: TaskProps) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.assigneId = assigneId;
    this.archived = archived;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getId(): string | undefined {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  getPriority(): number {
    return this.priority;
  }

  getAssigneId(): string | undefined {
    return this.assigneId;
  }

  isArchived(): boolean {
    return this.archived;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  getUpdatedAt(): string {
    return this.updatedAt;
  }

  getProjectName(): string {
    return this.projectName;
  }

  getProjectId(): string {
    return "";
  }

  getAssigneeName(): string {
    return this.assigneeName;
  }

  getReporterName(): string {
    return this.reporterName;
  }

  updateReporter(reporter: string) {
    this.reporterName = reporter;
  }
  updateAssignee(assignee: string) {
    this.assigneeName = assignee;
  }
  updateProjectName(projectName: string) {
    this.projectName = projectName;
  }

  toJson() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      assigneId: this.assigneId,
      archived: this.archived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toCreateJson() {
    return {
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      assigneId: this.assigneId,
      archived: this.archived,
    };
  }

  static from({
    id,
    title,
    status,
    description,
    priority,
    assigneId,
    archived,
    createdAt,
    updatedAt,
  }: TaskProps): Task {
    return new Task.Builder()
      .id(id)
      .title(title)
      .status(status)
      .description(description)
      .priority(priority)
      .assigneId(assigneId)
      .archived(archived)
      .createdAt(createdAt)
      .updatedAt(updatedAt)
      .build();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error("Please enter a title for the task.");
    }

    if (this.title.length < Task.MIN_TITLE_LENGTH) {
      throw new Error(`The task title must be at least ${Task.MIN_TITLE_LENGTH} characters long.`);
    }

    if (!this.status) {
      throw new Error("Please select a valid task status.");
    }

    if (!this.assigneId || this.assigneId.trim().length === 0) {
      throw new Error("Please assign this task to a user.");
    }
  }

  static Builder = class {
    #id?: string;
    #projectId: string;
    #title: string;
    #description?: string;
    #status: TaskStatus = "TODO";
    #priority: number = 0;
    #assigneId?: string;
    #archived: boolean = false;
    #createdAt?: Date;
    #updatedAt?: Date;
    #skipValidation: boolean = false;

    id(id: string): this {
      this.#id = id;
      return this;
    }

    //TODO ADD IN FINAL BUILD
    projectId(id: string) {
      this.#projectId = id;
      return this;
    }

    title(title: string): this {
      this.#title = title;
      return this;
    }

    description(description: string): this {
      this.#description = description;
      return this;
    }

    status(status: TaskStatus): this {
      this.#status = status;
      return this;
    }

    priority(priority: number): this {
      this.#priority = priority;
      return this;
    }

    assigneId(assigneId: string): this {
      this.#assigneId = assigneId;
      return this;
    }

    archived(archived: boolean): this {
      this.#archived = archived;
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

    skipValidation() {
      this.#skipValidation = true;
      return this;
    }

    build(): Task {
      if (this.#skipValidation === false) {
        if (!this.#title || this.#title.trim().length === 0) {
          throw new Error("Title is required before building a Task.");
        }

        if (this.#title.length < Task.MIN_TITLE_LENGTH) {
          throw new Error(`Task title must be at least ${Task.MIN_TITLE_LENGTH} characters long.`);
        }
      }

      return new Task({
        id: this.#id,
        title: this.#title,
        description: this.#description,
        status: this.#status,
        priority: this.#priority,
        assigneId: this.#assigneId,
        archived: this.#archived,
        createdAt: this.#createdAt,
        updatedAt: this.#updatedAt,
      });
    }
  };
}
