import { requireAuth } from "@/middlewares/require-auth.middleware";
import { Elysia } from "elysia";
import { StatusCodes } from "http-status-codes";
import { RoomController } from "./room.controller";
import { FindAllMyRoomSchema, FindOrCreatePrivateRoomSchema } from "./room.dto";

export const createRoomRoutes = (roomController: RoomController) => {
  return new Elysia({ prefix: "/api/room" })
    .use(requireAuth())
    .post(
      "/private",
      async ({ body, auth, set }) => {
        set.status = StatusCodes.CREATED;
        return await roomController.findOrCreatePrivateRoom(body, auth);
      },
      {
        body: FindOrCreatePrivateRoomSchema,
      }
    )
    .get(
      "/",
      async ({ auth, set, query }) => {
        set.status = StatusCodes.OK;
        return await roomController.findAllMyRoom(query, auth);
      },
      {
        query: FindAllMyRoomSchema,
      }
    );
};
