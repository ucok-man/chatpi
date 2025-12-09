import { Metadata } from "@/core/types";
import { Message, Room, User } from "@root/prisma/generated/client";

export interface IRoomService {
  isValidParticipantId(id: string): Promise<boolean>;

  createPrivateRoom(participantIds: string[]): Promise<Room>;

  findOrCreatePrivateRoom(
    participantIds?: string[]
  ): Promise<Room & { participants: User[] }>;

  findPrivateRoomFromParticipant(
    participantIds: string[]
  ): Promise<Room | null>;

  findAllRoomFromParticipant(
    param: {
      search?: string | null;
      page: number;
      pageSize: number;
    },
    participantId: string
  ): Promise<{
    rooms: (Room & { lastMessage: Message | null } & {
      participants: User[];
    })[];
    meta: Metadata;
  }>;

  findRoomFromId(roomId: string, cuid: string): Promise<Room>;
}
