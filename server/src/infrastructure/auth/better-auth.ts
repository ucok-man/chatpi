import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Config } from "../../config";
import { ILogger } from "../../core/interfaces/logger.interfaces";
import { DrizzleClient } from "../database/drizzle/drizzle.client";
import * as schema from "../database/drizzle/schema";

export const createAuthDrizzle = (
  config: Config,
  db: DrizzleClient,
  logger: ILogger
) => {
  return betterAuth({
    database: drizzleAdapter(db.client(), {
      provider: "pg",
      schema,
    }),
    basePath: "/internal",
    logger: {
      level: config.LOG_LEVEL,
      log(level, message, ...args) {
        switch (level) {
          case "debug":
            logger.debug(args, message);
            break;
          case "warn":
            logger.warn(args, message);
            break;
          case "info":
            logger.info(args, message);
            break;
          case "error":
            logger.error(args, message);
        }
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: config.NODE_ENV === "production", // Set to true in production
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    socialProviders: {
      github:
        config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET
          ? {
              clientId: config.GITHUB_CLIENT_ID,
              clientSecret: config.GITHUB_CLIENT_SECRET,
            }
          : undefined,
      google:
        config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET
          ? {
              clientId: config.GOOGLE_CLIENT_ID,
              clientSecret: config.GOOGLE_CLIENT_SECRET,
            }
          : undefined,
    },
    secret: config.BETTER_AUTH_SECRET,
    baseURL: config.BETTER_AUTH_URL,
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
  });
};

export type Auth = ReturnType<typeof createAuthDrizzle>;
