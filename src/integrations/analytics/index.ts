import { EventBus } from "@/core/events";
import { AnalyticsService } from "./analytics.services";
import { ConsoleProvider } from "./providers";

export * from "./analytics.types";
export * from "./analytics.services";

export const analyticsService = new AnalyticsService(new ConsoleProvider());

export function registerAnalyticsConsumer(
  eventBus: EventBus,
  analytics: AnalyticsService
) {
  eventBus.on("command.executed", (payload) => {
    analytics.track("command.executed", payload);
  });
}