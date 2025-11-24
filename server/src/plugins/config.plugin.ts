import Elysia from "elysia";
import { Config } from "../lib/config";

export const config = () =>
  new Elysia({ name: "config.plugin" })
    .decorate("config", Config.load())
    .as("global");
