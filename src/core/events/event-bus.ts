type Handler<T> = (payload: T) => void | Promise<void>;

export class EventBus<
  Events extends Record<string, unknown> = Record<string, unknown>,
> {
  private handlers: { [K in keyof Events]?: Handler<Events[K]>[] } = {};

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event]!.push(handler);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    const handlers = this.handlers[event] ?? [];

    for (const handler of handlers) {
      // fire-and-forget
      Promise.resolve()
        .then(() => handler(payload))
        .catch((err) => {
          console.error(`[EventBus] ${String(event)} failed`, err);
        });
    }
  }
}
