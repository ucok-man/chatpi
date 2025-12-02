import { AuthSession } from "@/core/types";
import { ErrUnprocessableEntity } from "@/utility/http-errors";
import { CreatePrivateRoomDTO, FindAllMyRoomDTO } from "./room.dto";
import { IRoomService } from "./room.service.interfaces";

export class RoomController {
  constructor(private roomService: IRoomService) {}

  async findOrCreatePrivateRoom(dto: CreatePrivateRoomDTO, auth: AuthSession) {
    const isValid = this.roomService.isValidParticipantId(
      dto.targetParticipantId
    );
    if (!isValid) {
      throw ErrUnprocessableEntity.construct([
        {
          path: "targetParticipantId",
          message: "Invalid participant id does not exist.",
        },
      ]);
    }

    return await this.roomService.findOrCreatePrivateRoom([
      dto.targetParticipantId,
      auth.user.id,
    ]);
  }

  async findAllMyRoom(param: FindAllMyRoomDTO, auth: AuthSession) {
    return await this.roomService.findAllRoomFromParticipant(
      param,
      auth.user.id
    );
  }
}
