import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';
import { EventBus } from '../../src/core/events/event-bus';
import { registerAnalyticsConsumer } from '../../src/integrations/analytics';
import { AnalyticsService } from '../../src/integrations/analytics/analytics.services';
import { AnalyticsProvider } from '../../src/integrations/analytics/analytics.types';

type AnalyticsEvents = {
  'command.executed': {
    command: string;
    userId: string;
    success: boolean;
  };
};

class InMemoryAnalyticsProvider implements AnalyticsProvider {
  calls: Array<{ event: string; payload: unknown }> = [];

  async track(event: string, payload: unknown): Promise<void> {
    this.calls.push({ event, payload });
  }
}

test('registerAnalyticsConsumer should forward command.executed events to analytics provider', async () => {
  const eventBus = new EventBus<AnalyticsEvents>();
  const provider = new InMemoryAnalyticsProvider();
  const analyticsService = new AnalyticsService(provider);

  registerAnalyticsConsumer(eventBus as EventBus, analyticsService);

  const payload = {
    command: '/status',
    userId: 'user-123',
    success: true,
  };

  eventBus.emit('command.executed', payload);

  // Event bus and analytics service are both non-blocking.
  await delay(0);

  assert.equal(provider.calls.length, 1);
  assert.equal(provider.calls[0]?.event, 'command.executed');
  assert.deepEqual(provider.calls[0]?.payload, payload);
});
