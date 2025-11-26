import { Elysia } from "elysia";
import { StatusCodes } from "http-status-codes";
import { HealthController } from "./health.controller";

export const createHealthRoutes = (healthController: HealthController) => {
  return new Elysia().get("/", ({ set }) => {
    set.status = StatusCodes.OK;
    return healthController.ping();
  });
};
