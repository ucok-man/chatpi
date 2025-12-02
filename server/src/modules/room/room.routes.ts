import { requireAuth } from "@/middlewares/require-auth.middleware";
import { Elysia } from "elysia";
import { StatusCodes } from "http-status-codes";
import { RoomController } from "./room.controller";
import { FindOrCreatePrivateRoomSchema } from "./room.dto";

export const createRoomRoutes = (roomController: RoomController) => {
  return new Elysia({ prefix: "/api/room/private" }).use(requireAuth()).post(
    "/",
    async ({ body, auth, set }) => {
      set.status = StatusCodes.CREATED;
      return await roomController.findOrCreatePrivateRoom(body, auth);
    },
    {
      body: FindOrCreatePrivateRoomSchema,
    }
  );
};
