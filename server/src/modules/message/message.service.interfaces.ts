import { Message, User } from "@root/prisma/generated/client";

export interface IMessageService {
  findAllForRoomId(roomId: string): Promise<(Message & { sender: User })[]>;

  createMessage(param: {
    contentText?: string;
    contentImage?: string;
    replyToId?: string;
    roomId: string;
    senderId: string;
  }): Promise<Message>;
}
