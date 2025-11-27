import { Config, createConfig } from "@/config";
import { IDatabaseClient } from "@/core/interfaces/database.interfaces";
import { ILogger } from "@/core/interfaces/logger.interfaces";
import {
  AuthInstance,
  createAuthDrizzle,
} from "@/infrastructure/auth/better-auth";
import { DrizzleClient } from "@/infrastructure/database/drizzle/drizzle.client";
import { PinoLogger } from "@/infrastructure/logger/pino.logger";
import { AuthController } from "@/modules/auth/auth.controller";
import { HealthController } from "@/modules/health/health.controller";
import { UserController } from "./modules/user/user.controller";
import { UserServiceDrizzle } from "./modules/user/user.service.drizzle";
import { IUserService } from "./modules/user/user.service.interfaces";

export interface Container {
  config: Config;
  logger: ILogger;
  db: IDatabaseClient;
  auth: AuthInstance;
  healthController: HealthController;
  authController: AuthController;
  userController: UserController;
}

export const createContainer = (): Container => {
  // Core infrastructure
  const config = createConfig();
  const logger = new PinoLogger(config);

  // Database client selection based on config
  let db: IDatabaseClient;
  if (config.DATABASE_PROVIDER === "drizzle") {
    logger.info("Using Drizzle as database provider");
    db = new DrizzleClient(config, logger);
  } else {
    const err = new Error(
      `Database provider is not implemented: ${config.DATABASE_PROVIDER}`
    );
    logger.error(err, "Failed on container initialization");
    process.exit(1);
  }

  // Infrastucture Auth
  const auth = createAuthDrizzle(config, db as any, logger);

  // Modules
  const healthController = new HealthController(config);
  const authController = new AuthController(auth);

  let userService: IUserService;
  if (config.DATABASE_PROVIDER === "drizzle") {
    userService = new UserServiceDrizzle(db as any);
  } else {
    const err = new Error(
      `Database provider is not implemented: ${config.DATABASE_PROVIDER}`
    );
    logger.error(err, "Failed on container initialization");
    process.exit(1);
  }
  const userController = new UserController(userService);

  return {
    config,
    logger,
    db,
    auth,
    healthController,
    authController,
    userController,
  };
};
