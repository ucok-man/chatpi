import { Elysia } from "elysia";
import { ILogger } from "../core/interfaces/logger.interfaces";

// TODO: complete this
export const createErrorHandler = (logger: ILogger) => {
  return new Elysia({ name: "error.middleware" })
    .onError((ctx) => {
      const { code, error, set, request } = ctx;

      if (code === "NOT_FOUND") {
        set.status = 404;
        return {
          error: "Not Found",
          message: "The requested resource was not found",
        };
      }

      if (code === "VALIDATION") {
        set.status = 422;

        const detail = error.detail(error, true) as any;
        console.log({ detail });
        if (!detail.errors?.length) {
          return {
            error: "Validation Error",
            message: error.message,
          };
        }

        const errmap = detail.errors.map((item: any) => ({
          path: item.path,
          message: item.message,
        }));

        return {
          error: "Validation Error",
          message: errmap,
        };
      }

      // DEFAULT UNKNOWN ERROR
      logger.error(
        { route: request.url, method: request.method },
        "Failed to serve request"
      );
      logger.error(error);

      set.status = 500;
      return {
        error: "Internal Server Error",
        message: "Sorry, we encountered problem in our server",
      };
    })
    .as("global");
};
