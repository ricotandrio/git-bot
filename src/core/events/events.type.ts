export type AnalyticsEventMap = {
  "command.executed": {
    command: string;
    userId: string;
    success: boolean;
    latency: number;
  };

  "github.issue_updated": {
    issueId: number;
    repo: string;
    userId: string;
  };
};

export type EventName = keyof AnalyticsEventMap;

export type EventPayload<T extends EventName> = AnalyticsEventMap[T];