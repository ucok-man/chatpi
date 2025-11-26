import { HealthController } from "@/modules/health/health.controller";
import { Elysia } from "elysia";
import { StatusCodes } from "http-status-codes";

export const createHealthRoutes = (healthController: HealthController) => {
  return new Elysia().get("/", ({ set }) => {
    set.status = StatusCodes.OK;
    return healthController.ping();
  });
};
