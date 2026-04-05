import { AnalyticsProvider } from './analytics.types';

export class AnalyticsService {
  constructor(private provider: AnalyticsProvider) {}

  track(event: string, payload: any) {
    // non-blocking
    Promise.resolve()
      .then(() => this.provider.track(event, payload))
      .catch(() => {});
  }
}
