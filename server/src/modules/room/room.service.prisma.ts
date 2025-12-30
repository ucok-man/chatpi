import { Metadata } from "@/core/types";
import { PrismaDbClient } from "@/infrastructure/database/prisma/client";
import { ErrInternalServer, ErrNotFound } from "@/utility/http-errors";
import { Message, Room, User } from "@root/prisma/generated/client";
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
    return room;
  }

  async createPrivateRoom(
    participantIds?: string[]
  ): Promise<Room & { participants: User[] }> {
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
          include: {
            participants: true,
          },
        });
        return room;
      });
    }

    return await this.db.client().room.create({
      data: {
        roomType: "private",
      },
      include: {
        participants: true,
      },
    });
  }

  async findPrivateRoomFromParticipant(
    participantIds: string[]
  ): Promise<(Room & { participants: User[] }) | null> {
    const room = await this.db.client().room.findFirst({
      where: {
        participants: {
          every: {
            id: { in: participantIds },
          },
        },
      },
      include: {
        participants: true,
      },
    });

    if (!room) {
      return null;
    }

    if (!room.participants.length) {
      throw new ErrInternalServer(
        new Error("Room found but it should have participants")
      );
    }

    const sortedParticipantIds = participantIds.sort();
    const sortedResultParticipantIds = room.participants
      .map((p) => p.id)
      .sort();

    if (sortedResultParticipantIds.length !== sortedParticipantIds.length) {
      return null;
    }

    const isExactMatch = sortedResultParticipantIds.every((resultId, idx) => {
      return resultId === sortedParticipantIds[idx];
    });

    if (!isExactMatch) {
      return null;
    }

    return room;
  }

  async findAllRoomFromParticipant(
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
  }> {
    const { search, page, pageSize } = param;
    const offset = (page - 1) * pageSize;

    // No search term - return all with pagination
    if (!search || search.trim() === "") {
      const rooms = await this.db.client().room.findMany({
        where: {
          participants: {
            some: { id: participantId },
          },
          // lastMessageId: {
          //   not: null,
          // },
        },
        include: {
          participants: true,
          lastMessage: true,
        },
      });

      const count = await this.db.client().room.count({
        where: {
          participants: {
            some: { id: participantId },
          },
          lastMessageId: {
            not: null,
          },
        },
      });

      const lastPage = Math.ceil(count / pageSize);
      const nextPage = page < lastPage ? page + 1 : null;

      return {
        rooms: rooms,
        meta: {
          total: count,
          pageSize: pageSize,
          currentPage: page,
          nextPage: nextPage,
          lastPage: lastPage,
        },
      };
    }

    // PostgreSQL full-text search
    const searchQuery = search.trim().split(" ").join(":* || ") + ":*";

    const rooms = await this.db.client().room.findMany({
      where: {
        participants: {
          some: {
            id: participantId,
            OR: [
              {
                name: {
                  search: searchQuery,
                },
              },
              {
                email: {
                  search: searchQuery,
                },
              },
            ],
          },
        },
        lastMessageId: {
          not: null,
        },
      },
      take: pageSize,
      skip: offset,
      include: {
        lastMessage: true,
        participants: true,
      },
    });

    const count = await this.db.client().room.count({
      where: {
        participants: {
          some: {
            id: participantId,
            OR: [
              {
                name: {
                  search: searchQuery,
                },
              },
              {
                email: {
                  search: searchQuery,
                },
              },
            ],
          },
        },
        lastMessageId: {
          not: null,
        },
      },
    });

    const lastPage = Math.ceil(count / pageSize);
    const nextPage = page < lastPage ? page + 1 : null;

    return {
      rooms: rooms,
      meta: {
        total: count,
        pageSize: pageSize,
        currentPage: page,
        nextPage: nextPage,
        lastPage: lastPage,
      },
    };
  }

  async findRoomFromId(roomId: string, cuid: string): Promise<Room> {
    const room = await this.db.client().room.findUnique({
      where: {
        id: roomId,
        participants: {
          some: {
            id: cuid,
          },
        },
      },
    });

    if (!room) {
      throw new ErrNotFound();
    }

    return room;
  }
}
