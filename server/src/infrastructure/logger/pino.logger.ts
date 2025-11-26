import { Config } from "@/config";
import { ILogger } from "@/core/interfaces/logger.interfaces";
import pino, { Logger } from "pino";

export class PinoLogger implements ILogger {
  private logger: Logger;

  constructor(config: Config) {
    this.logger = pino({
      level: config.LOG_LEVEL,
      transport:
        config.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    });
  }

  info(objOrMsg: object | string, msg?: string): void {
    if (typeof objOrMsg === "string") {
      this.logger.info(objOrMsg);
    } else {
      this.logger.info(objOrMsg, msg);
    }
  }

  error(objOrMsg: object | string, msg?: string): void {
    if (typeof objOrMsg === "string") {
      this.logger.error(objOrMsg);
    } else {
      this.logger.error(objOrMsg, msg);
    }
  }

  warn(objOrMsg: object | string, msg?: string): void {
    if (typeof objOrMsg === "string") {
      this.logger.warn(objOrMsg);
    } else {
      this.logger.warn(objOrMsg, msg);
    }
  }

  debug(objOrMsg: object | string, msg?: string): void {
    if (typeof objOrMsg === "string") {
      this.logger.debug(objOrMsg);
    } else {
      this.logger.debug(objOrMsg, msg);
    }
  }
}
