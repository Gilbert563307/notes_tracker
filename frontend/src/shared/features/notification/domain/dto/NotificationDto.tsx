import { ALERT_TYPES } from "../../constants";

export class NotificationDto {
  readonly #message: string;
  readonly #type: number;

  /**
   * @param message - The notification message content.
   * @param type - The severity/type of the alert.
   */
  constructor(message: string, type: number) {
    this.validate(message);
    this.#message = message;
    this.#type = type;
  }

  public getMessage(): string {
    return this.#message;
  }

  public getType(): number {
    return this.#type;
  }

  public toJson(): { message: string; type: number } {
    return { message: this.#message, type: this.#type };
  }

  /**
   * Inner Builder class for fluent construction.
   */
  static Builder = class {
    #message: string = "";
    #type: number = ALERT_TYPES.PRIMARY;

    public message(value: string): this {
      this.#message = value;
      return this;
    }

    public info(): this {
      this.#type = ALERT_TYPES.INFO;
      return this;
    }

    public danger(): this {
      this.#type = ALERT_TYPES.DANGER;
      return this;
    }

    public success(): this {
      this.#type = ALERT_TYPES.SUCCESS;
      return this;
    }

    public primary(): this {
      this.#type = ALERT_TYPES.PRIMARY;
      return this;
    }

    public build(): NotificationDto {
      return new NotificationDto(this.#message, this.#type);
    }
  };

  private validate(message: string): void {
    if (typeof message !== "string") {
      throw new Error("Notification message must be a string.");
    }
  }
}
