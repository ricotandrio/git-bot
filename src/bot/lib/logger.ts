import pino from "pino";
import { config } from "@/bot/config";

const isDev = config.NODE_ENV === "development";

const options: pino.LoggerOptions = {
  level: isDev ? "debug" : "info",
};

if (isDev) {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname",
    },
  };
}

export const logger = pino(options);