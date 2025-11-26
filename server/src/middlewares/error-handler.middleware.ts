import { ILogger } from "@/core/interfaces/logger.interfaces";
import {
  ErrInternalServer,
  ErrNotFound,
  ErrUnprocessableEntity,
  HttpError,
} from "@/utility/http-errors";
import { Elysia } from "elysia";
import { StatusCodes } from "http-status-codes";

// TODO: complete this

const logerror = (
  logger: ILogger,
  param: { error: any; meta: Record<string, any> }
) => {
  logger.error(param.meta, "Failed to serve request");
  logger.error(param.error);
};

export const createErrorHandler = (logger: ILogger) => {
  return new Elysia({ name: "error.middleware" })
    .onError((ctx) => {
      const { code, error, set, request } = ctx;

      if (code === "NOT_FOUND") {
        set.status = StatusCodes.NOT_FOUND;
        return new ErrNotFound().toResponse();
      }

      if (code === "VALIDATION") {
        const detail = error.detail(error, true) as any;

        if (!detail.errors?.length) {
          set.status = StatusCodes.UNPROCESSABLE_ENTITY;
          return new ErrUnprocessableEntity(error.message).toResponse();
        }

        const errmap = detail.errors.map((item: any) => ({
          path: item.path,
          message: item.message,
        }));

        set.status = StatusCodes.UNPROCESSABLE_ENTITY;
        return new ErrUnprocessableEntity(errmap).toResponse();
      }

      if (error instanceof HttpError) {
        if (error.statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
          logerror(logger, {
            error: error.internal,
            meta: { route: request.url, method: request.method },
          });
        }

        set.status = error.statusCode;
        return error.toResponse();
      }

      // UNKNOWN ERROR
      logerror(logger, {
        error: error,
        meta: { route: request.url, method: request.method },
      });

      set.status = StatusCodes.INTERNAL_SERVER_ERROR;
      return new ErrInternalServer(error).toResponse();
    })
    .as("global");
};
