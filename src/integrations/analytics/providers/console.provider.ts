import { AnalyticsProvider } from "../analytics.types";

export class ConsoleProvider implements AnalyticsProvider {
  async track(event: string, payload: any) {
    console.log(`[Analytics] ${event}`, payload);
  }
}