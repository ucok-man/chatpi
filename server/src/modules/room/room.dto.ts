import z from "zod";

export const FindOrCreatePrivateRoomSchema = z.object({
  targetParticipantId: z.uuid(),
});

export type CreatePrivateRoomDTO = z.infer<
  typeof FindOrCreatePrivateRoomSchema
>;

export const FindAllMyRoomSchema = z.object({
  search: z.string().optional().nullish().default(""),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type FindAllMyRoomDTO = z.infer<typeof FindAllMyRoomSchema>;
