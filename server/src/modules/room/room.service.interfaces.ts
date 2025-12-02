import { Room, User } from "@root/prisma/generated/client";

export interface IRoomService {
  isValidParticipantId(id: string): Promise<boolean>;

  createPrivateRoom(participantIds: string[]): Promise<Room>;

  findOrCreatePrivateRoom(
    participantIds?: string[]
  ): Promise<Room & { participants: User[] }>;

  findPrivateRoomFromParticipant(
    participantIds: string[]
  ): Promise<Room | null>;
}
