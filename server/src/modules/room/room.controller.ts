import { AuthSession } from "@/core/types";
import { ErrUnprocessableEntity } from "@/utility/http-errors";
import { IMessageService } from "../message/message.service.interfaces";
import {
  CreatePrivateRoomDTO,
  FindAllMessageDTO,
  FindAllMyRoomDTO,
  SendMessageDTO,
} from "./room.dto";
import { IRoomService } from "./room.service.interfaces";

export class RoomController {
  constructor(
    private roomService: IRoomService,
    private messageService: IMessageService
  ) {}

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

    const room = await this.roomService.findOrCreatePrivateRoom([
      dto.targetParticipantId,
      auth.user.id,
    ]);

    return { room };
  }

  async findAllMyRoom(dto: FindAllMyRoomDTO, auth: AuthSession) {
    const { meta, rooms } = await this.roomService.findAllRoomFromParticipant(
      dto,
      auth.user.id
    );

    return { meta, rooms };
  }

  async findAllMessage(dto: FindAllMessageDTO, auth: AuthSession) {
    const room = await this.roomService.findRoomFromId(
      dto.roomId,
      auth.user.id
    );

    const messages = await this.messageService.findAllForRoomId(room.id);
    return { messages };
  }

  async sendMessage(dto: SendMessageDTO, auth: AuthSession) {
    const room = await this.roomService.findRoomFromId(
      dto.roomId,
      auth.user.id
    );

    const message = await this.messageService.createMessage({
      roomId: room.id,
      senderId: auth.user.id,
      contentImage: dto.contentImage ?? undefined,
      contentText: dto.contentText ?? undefined,
      replyToId: dto.replyToId ?? undefined,
    });

    return { message };
  }
}
