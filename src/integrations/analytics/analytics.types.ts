export interface AnalyticsProvider {
  track(event: string, payload: any): Promise<void>;
}
