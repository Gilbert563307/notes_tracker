/** * Interface defining the shape of an Observer.
 */
interface Observer<T> {
  next: (data: T[]) => void;
}

/**
 * Service for managing data notifications to subscribers.
 * Implements a simple observer pattern.
 */
export class NotificationObserver<T> {
  /**
   * Stored data items to be sent to subscribers.
   */
  private serviceData: T[] = [];

  /**
   * List of subscribed observers.
   */
  private subscribers: Observer<T>[] = [];

  /**
   * Adds a new data item and notifies all subscribers.
   * @param item - The data item to add.
   */
  public addData(item: T): void {
    // Updated logic to actually store the item in the array
    this.serviceData = [...this.serviceData, item];
    this.notify(this.serviceData);
  }

  /** Clears the last item from service data */
  public clear(): void {
    this.serviceData.pop();
    this.notify(this.serviceData); // Usually good to notify on change
  }

  /**
   * Subscribes an observer to receive updates.
   * @param observer - The observer to subscribe.
   */
  public subscribe(observer: Observer<T>): void {
    this.subscribers = [...this.subscribers, observer];
  }

  /**
   * Unsubscribes an observer from receiving updates.
   * @param observer - The observer to remove.
   */
  public unsubscribe(observer: Observer<T>): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== observer);
  }

  /**
   * Notifies all subscribed observers with the given data.
   * @param data - The data to send to observers.
   */
  private notify(data: T[]): void {
    this.subscribers.forEach((observer) => observer.next(data));
  }
}

/** Singleton instance of NotificationObserver */
const notificationObserver = new NotificationObserver<any>();
export { notificationObserver };
