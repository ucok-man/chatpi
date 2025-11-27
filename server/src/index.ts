import { createContainer } from "@/container";
import { createCors } from "@/middlewares/cors.middleware";
import { createErrorHandler } from "@/middlewares/error-handler.middleware";
import { createSwagger } from "@/middlewares/swagger.middleware";
import { createAuthPlugin } from "@/modules/auth/auth.plugin";
import { createAuthRoutes } from "@/modules/auth/auth.routes";
import { createHealthRoutes } from "@/modules/health/health.routes";
import { Elysia } from "elysia";
import { createUserRoutes } from "./modules/user/user.routes";

const container = createContainer();
const {
  config,
  logger,
  db,
  auth,
  healthController,
  authController,
  userController,
} = container;

// Connect to database
db.connect()
  .catch((error) => {
    logger.error({ error }, "Failed to connect database");
    process.exit(1);
  })
  .then(() => {
    const app = new Elysia()
      .use(createCors())
      .use(createSwagger(config.VERSION))
      .use(createErrorHandler(logger))
      .use(createAuthPlugin(auth))
      .use(createHealthRoutes(healthController))
      .use(createAuthRoutes(auth, authController))
      .use(createUserRoutes(userController));

    app.listen(config.PORT, () => {
      logger.info(`Server is running at http://localhost:${config.PORT}`);
    });
  });

// Graceful shutdown
const shutdown = async () => {
  logger.info("Shutting down gracefully...");
  await db.disconnect();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
