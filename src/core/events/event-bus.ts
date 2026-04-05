type Handler<T> = (payload: T) => void | Promise<void>;

export class EventBus {
  private handlers: Record<string, Handler<any>[]> = {};

  on<T extends string>(event: T, handler: Handler<any>) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  emit(event: string, payload: any) {
    const handlers = this.handlers[event] || [];

    for (const handler of handlers) {
      // fire-and-forget
      Promise.resolve()
        .then(() => handler(payload))
        .catch((err) => {
          console.error(`[EventBus] ${event} failed`, err);
        });
    }
  }
}
