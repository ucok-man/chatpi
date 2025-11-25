import { Elysia } from "elysia";
import { HealthController } from "./health.controller";

export const createHealthRoutes = (healthController: HealthController) => {
  return new Elysia().get("/", ({ set }) => {
    set.status = "OK";
    return healthController.ping();
  });
};
