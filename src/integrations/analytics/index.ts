import { EventBus } from "@/core/events";
import { AnalyticsService } from "./analytics.services";

export function registerAnalyticsConsumer(
  eventBus: EventBus,
  analytics: AnalyticsService
) {
  eventBus.on("command.executed", (payload) => {
    analytics.track("command.executed", payload);
  });
}