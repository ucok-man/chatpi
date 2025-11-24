import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { Module } from "./modules";
import { config } from "./plugins/config.plugin";

// TODO: change port to use
const app = new Elysia({
  name: "chatpi-server",
})
  .use(config)
  .use(cors())
  .use(Module.health)
  .listen({
    port: process.env.PORT || "4000",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
