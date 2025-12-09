import { PrismaDbClient } from "@/infrastructure/database/prisma/client";
import {
  ErrInternalServer,
  ErrUnprocessableEntity,
} from "@/utility/http-errors";
import { Message, User } from "@root/prisma/generated/client";
import { IMessageService } from "./message.service.interfaces";

export class MessageServicePrisma implements IMessageService {
  constructor(private db: PrismaDbClient) {}

  async createMessage(param: {
    contentText?: string;
    contentImage?: string;
    replyToId?: string;
    roomId: string;
    senderId: string;
  }): Promise<Message> {
    if (param.contentText && param.contentImage) {
      throw new ErrInternalServer(
        "required one of content text or context image to be provided"
      );
    }

    if (param.replyToId) {
      const exist = await this.db.client().message.findUnique({
        where: {
          id: param.replyToId,
        },
      });
      if (!exist) {
        throw ErrUnprocessableEntity.construct([
          {
            message: "Invalid replyToId value",
            path: "replyToId",
          },
        ]);
      }
    }

    return await this.db.client().message.create({
      data: {
        content: param.contentText,
        image: param.contentImage,
        replyToId: param.replyToId,
        roomId: param.roomId,
        senderId: param.senderId,
      },
    });
  }

  async findAllForRoomId(
    roomId: string
  ): Promise<(Message & { sender: User })[]> {
    const messages = await this.db.client().message.findMany({
      where: {
        roomId: roomId,
      },
      include: {
        sender: true,
      },
    });

    return messages;
  }
}
