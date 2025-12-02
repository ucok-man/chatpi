import { Config, createConfig } from "@/config";
import { IDatabaseClient } from "@/core/interfaces/database.interfaces";
import { ILogger } from "@/core/interfaces/logger.interfaces";
import {
  AuthInstance,
  createAuthPrisma,
} from "@/infrastructure/auth/better-auth";
import { PinoLogger } from "@/infrastructure/logger/pino.logger";
import { AuthController } from "@/modules/auth/auth.controller";
import { HealthController } from "@/modules/health/health.controller";
import { PrismaDbClient } from "./infrastructure/database/prisma/client";
import { RoomController } from "./modules/room/room.controller";
import { IRoomService } from "./modules/room/room.service.interfaces";
import { RoomServicePrisma } from "./modules/room/room.service.prisma";
import { UserController } from "./modules/user/user.controller";
import { IUserService } from "./modules/user/user.service.interfaces";
import { UserServicePrisma } from "./modules/user/user.service.prisma";

class UnsupportedProviderError extends Error {
  constructor(provider: string) {
    super(`Database provider is not implemented: ${provider}`);
    this.name = "UnsupportedProviderError";
  }
}

const createDatabaseClient = (
  config: Config,
  logger: ILogger
): IDatabaseClient => {
  if (config.DATABASE_PROVIDER === "prisma") {
    logger.info("Using Prisma as database provider");
    return new PrismaDbClient(config, logger);
  }

  throw new UnsupportedProviderError(config.DATABASE_PROVIDER);
};

const createUserService = (
  config: Config,
  db: IDatabaseClient
): IUserService => {
  if (config.DATABASE_PROVIDER === "prisma") {
    return new UserServicePrisma(db as any);
  }

  throw new UnsupportedProviderError(config.DATABASE_PROVIDER);
};

const createRoomService = (
  config: Config,
  db: IDatabaseClient
): IRoomService => {
  if (config.DATABASE_PROVIDER === "prisma") {
    return new RoomServicePrisma(db as any);
  }

  throw new UnsupportedProviderError(config.DATABASE_PROVIDER);
};

export interface Container {
  config: Config;
  logger: ILogger;
  db: IDatabaseClient;
  auth: AuthInstance;
  healthController: HealthController;
  authController: AuthController;
  userController: UserController;
  roomController: RoomController;
}

export const createContainer = (): Container => {
  const config = createConfig();
  const logger = new PinoLogger(config);

  try {
    // Infrastructure
    const db = createDatabaseClient(config, logger);
    const auth = createAuthPrisma(config, db as any, logger);

    // Services
    const userService = createUserService(config, db);
    const roomService = createRoomService(config, db);

    // Controllers
    const healthController = new HealthController(config);
    const authController = new AuthController(auth);
    const userController = new UserController(userService);
    const roomController = new RoomController(roomService);

    return {
      config,
      logger,
      db,
      auth,
      healthController,
      authController,
      userController,
      roomController,
    };
  } catch (err: any) {
    logger.error(err, "Failed on container initialization");
    process.exit(1);
  }
};
