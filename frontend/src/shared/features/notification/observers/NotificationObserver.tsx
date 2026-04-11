import type { NotificationDto } from "../domain/dto/NotificationDto";

export class NotificationObserver<T> {
  #notification: T | null = null;
  #subscribers: Array<{ next: (data: T) => void }> = [];

  add(item: T) {
    this.#notification = item;
    this.notify(this.#notification);
  }

  clear() {
    this.#notification = null;
  }

  subscribe(observer: { next: (data: T) => void }) {
    this.#subscribers = [...this.#subscribers, observer];
  }

  unsubscribe(observer: { next: (data: T) => void }) {
    this.#subscribers = this.#subscribers.filter((sub) => sub !== observer);
  }

  notify(data: T) {
    this.#subscribers.forEach((observer) => observer.next(data));
  }
}

const notificationObserver = new NotificationObserver<NotificationDto>();
export { notificationObserver };
