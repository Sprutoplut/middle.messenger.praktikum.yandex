type EventListener<T extends unknown[] = []> = (...args: T) => void;

export default class EventBus<E extends string> {
  private listeners: Record<E, EventListener<unknown[]>[]>;

  constructor() {
    this.listeners = {} as Record<E, EventListener<unknown[]>[]>;
  }

  on(event: E, callback: EventListener<unknown[]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: E, callback: EventListener<unknown[]>) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback,
    );
  }

  emit<T extends unknown[] = []>(event: E, ...args: T) {
    if (!this.listeners[event]) {
      return;
      // throw new Error(`Нет события: ${event}`);
    }
    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}
