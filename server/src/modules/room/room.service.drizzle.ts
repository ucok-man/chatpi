import { DrizzleClient } from "@/infrastructure/database/drizzle/drizzle.client";
import { user } from "@/infrastructure/database/drizzle/schema";
import { ErrUnprocessableEntity } from "@/utility/http-errors";
import { eq } from "drizzle-orm";
import { IRoomService } from "./room.service.interfaces";

export class RoomService implements IRoomService {
  constructor(private db: DrizzleClient) {}

  async validateParticipantIds(ids: string[]): Promise<string[]> {
    const jobs = ids.map(async (id) => {
      return await this.db.client().query.user.findFirst({
        where: eq(user.id, id),
      });
    });

    const participants = await Promise.all(jobs);

    // Find invalid IDs - those that returned undefined
    const invalidIds = ids.filter(
      (_, index) => participants[index] === undefined
    );

    if (invalidIds.length > 0) {
      throw ErrUnprocessableEntity.construct([
        {
          path: "participantIds",
          message: `Invalid user IDs: ${invalidIds.join(", ")}`,
        },
      ]);
    }

    return ids;
  }
}
