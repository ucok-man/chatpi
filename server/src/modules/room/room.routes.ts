import { requireAuth } from "@/middlewares/require-auth.middleware";
import { Elysia } from "elysia";
import { StatusCodes } from "http-status-codes";
import { RoomController } from "./room.controller";
import {
  FindAllMessageParamSchema,
  FindAllMyRoomQuerySchema,
  FindOrCreatePrivateRoomBodySchema,
  SendMessageBodySchema,
  SendMessageParamSchema,
} from "./room.dto";

export const createRoomRoutes = (roomController: RoomController) => {
  return (
    new Elysia({ prefix: "/api/rooms" })
      .use(requireAuth())

      // Create private chat endpoint
      .post(
        "/private",
        async ({ body, auth, set }) => {
          set.status = StatusCodes.CREATED;
          return await roomController.findOrCreatePrivateRoom(body, auth);
        },
        {
          body: FindOrCreatePrivateRoomBodySchema,
        }
      )

      // List all chat where has current user in it.
      .get(
        "/",
        async ({ auth, set, query }) => {
          set.status = StatusCodes.OK;
          return await roomController.findAllMyRoom(query, auth);
        },
        {
          query: FindAllMyRoomQuerySchema,
        }
      )

      // Send message on the room
      .post(
        "/:roomId/messages",
        async ({ params, body, auth, set }) => {
          set.status = StatusCodes.CREATED;
          return await roomController.sendMessage({ ...params, ...body }, auth);
        },
        {
          params: SendMessageParamSchema,
          body: SendMessageBodySchema,
        }
      )

      // Get all messages in the room
      .get(
        "/:roomId/messages",
        async ({ params, auth, set }) => {
          set.status = StatusCodes.OK;
          return await roomController.findAllMessage(params, auth);
        },
        {
          params: FindAllMessageParamSchema,
        }
      )
  );
};
