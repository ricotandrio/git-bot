import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';
import { EventBus } from '../../src/core/events/event-bus';

type TestEvents = {
  ping: { id: number };
};

test('EventBus should execute all handlers and isolate handler failures', async () => {
  const bus = new EventBus<TestEvents>();
  const received: number[] = [];
  const loggedErrors: unknown[][] = [];

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    loggedErrors.push(args);
  };

  try {
    bus.on('ping', ({ id }) => {
      received.push(id);
      throw new Error('handler failed');
    });

    bus.on('ping', ({ id }) => {
      received.push(id + 1);
    });

    bus.emit('ping', { id: 1 });

    // Event handlers run in a Promise chain (fire-and-forget).
    await delay(0);

    assert.deepEqual(received, [1, 2]);
    assert.equal(loggedErrors.length, 1);
  } finally {
    console.error = originalConsoleError;
  }
});
