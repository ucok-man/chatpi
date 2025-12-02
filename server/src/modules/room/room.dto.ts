import z from "zod";

export const FindOrCreatePrivateRoomSchema = z.object({
  targetParticipantId: z.uuid(),
});

export type CreatePrivateRoomDTO = z.infer<
  typeof FindOrCreatePrivateRoomSchema
>;
