export type AnalyticsEventMap = {
  "command.executed": {
    command: string;
    userId: string;
    success: boolean;
  };
};

export type EventName = keyof AnalyticsEventMap;

export type EventPayload<T extends EventName> = AnalyticsEventMap[T];