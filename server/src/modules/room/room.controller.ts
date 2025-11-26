import { AuthSession } from "@/core/types";
import { ErrBadRequest } from "@/utility/http-errors";
import { CreateRoomDTO } from "./room.dto";
import { IRoomService } from "./room.service.interfaces";

export class RoomController {
  constructor(private roomService: IRoomService) {}

  async create(dto: CreateRoomDTO, auth: AuthSession) {
    // Validate participants
    const participantIds = await this.roomService.validateParticipantIds(
      dto.participantIds
    );
    participantIds.push(auth.user.id);

    if (dto.isGroup) {
      throw new ErrBadRequest("Not Implemented Yet!");
    }
  }
}
