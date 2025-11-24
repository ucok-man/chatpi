import { Elysia } from "elysia";
import { config } from "../../plugins/config.plugin";

export const health = new Elysia({ name: "health.module" })
  .use(config())
  .get("/", ({ status, config }) => {
    return status("OK", {
      status: "available",
      version: "1.0.0", // TODO: still dont know best pattern to make this not inlined
      environment: config.env,
    });
  });
