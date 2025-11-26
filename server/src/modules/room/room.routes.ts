import { requireAuth } from "@/middlewares/require-auth.middleware";
import { Elysia } from "elysia";
import { StatusCodes } from "http-status-codes";
import { RoomController } from "./room.controller";
import { CreateRoomSchema } from "./room.dto";

export const createRoomRoutes = (roomController: RoomController) => {
  return new Elysia({ prefix: "/api/room" }).use(requireAuth()).post(
    "/",
    async ({ body, auth, set }) => {
      set.status = StatusCodes.CREATED;
      return await roomController.create(body, auth);
    },
    {
      body: CreateRoomSchema,
    }
  );
};
