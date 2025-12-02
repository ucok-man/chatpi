import { PrismaDbClient } from "@/infrastructure/database/prisma/client";
import { ErrInternalServer } from "@/utility/http-errors";
import { Room, User } from "@root/prisma/generated/client";
import { IRoomService } from "./room.service.interfaces";

export class RoomServicePrisma implements IRoomService {
  constructor(private db: PrismaDbClient) {}

  async isValidParticipantId(id: string): Promise<boolean> {
    const participant = await this.db.client().user.findUnique({
      where: {
        id: id,
      },
    });
    return participant !== undefined;
  }

  async findOrCreatePrivateRoom(
    participantIds: string[]
  ): Promise<Room & { participants: User[] }> {
    let room = await this.findPrivateRoomFromParticipant(participantIds);
    if (!room) {
      room = await this.createPrivateRoom(participantIds);
    }

    const participants = await this.db.client().user.findMany({
      where: {
        rooms: {
          some: {
            id: room.id,
          },
        },
      },
    });

    return {
      ...room,
      participants: participants,
    };
  }

  async createPrivateRoom(participantIds?: string[]): Promise<Room> {
    if (participantIds?.length) {
      if (participantIds.length !== 2) {
        throw new ErrInternalServer("Participants ids length must be 2");
      }

      return await this.db.client().$transaction(async (tx) => {
        const room = tx.room.create({
          data: {
            roomType: "private",
            participants: {
              connect: participantIds.map((id) => ({ id })),
            },
          },
        });
        return room;
      });
    }

    return await this.db.client().room.create({
      data: {
        roomType: "private",
      },
    });
  }

  async findPrivateRoomFromParticipant(
    participantIds: string[]
  ): Promise<Room | null> {
    const room = await this.db.client().room.findFirst({
      where: {
        participants: {
          every: {
            OR: participantIds.map((id) => ({ id })),
          },
        },
      },
      include: {
        participants: true,
      },
    });
    if (!room?.participants) {
      throw new ErrInternalServer(
        new Error("Room found but it should have participants")
      );
    }

    const sortedParticipantIds = participantIds.sort();
    const sortedResultParticipantIds = room.participants.sort();

    if (sortedResultParticipantIds.length !== sortedParticipantIds.length) {
      return null;
    }

    const isExactMatch = sortedResultParticipantIds.every(
      (result, idx) => result.id === sortedParticipantIds[idx]
    );
    if (!isExactMatch) {
      return null;
    }

    return {
      id: room.id,
      createdAt: room.createdAt,
      lastMessageId: room.lastMessageId,
      roomType: room.roomType,
      updatedAt: room.updatedAt,
    };
  }
}
