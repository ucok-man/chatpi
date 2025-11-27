import { requireAuth } from "@/middlewares/require-auth.middleware";
import { Elysia } from "elysia";
import { StatusCodes } from "http-status-codes";
import { UserController } from "./user.controller";
import { GetAllUserSchema } from "./user.dto";

export const createUserRoutes = (userController: UserController) => {
  return new Elysia({ prefix: "/api/user" }).use(requireAuth()).get(
    "/",
    async ({ query, auth, set }) => {
      set.status = StatusCodes.OK;
      return await userController.getAll(query, auth);
    },
    {
      query: GetAllUserSchema,
    }
  );
};
