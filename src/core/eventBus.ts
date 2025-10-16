type EventListener<T extends any[] = []> = (...args: T) => void;

export default class EventBus<E extends string> {
  private listeners: Record<E, EventListener<any[]>[]>;

  constructor() {
    this.listeners = {} as Record<E, EventListener<any[]>[]>;
  }

  on(event: E, callback: EventListener<any[]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: E, callback: EventListener<any[]>) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback,
    );
  }

  emit<T extends any[] = []>(event: E, ...args: T) {
    if (!this.listeners[event]) {
      return;
      // throw new Error(`Нет события: ${event}`);
    }
    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}
