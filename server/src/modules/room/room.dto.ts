import z from "zod";

export const FindOrCreatePrivateRoomBodySchema = z.object({
  targetParticipantId: z.uuid(),
});

export type CreatePrivateRoomDTO = z.infer<
  typeof FindOrCreatePrivateRoomBodySchema
>;

export const FindAllMyRoomQuerySchema = z.object({
  search: z.string().optional().nullish().default(""),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type FindAllMyRoomDTO = z.infer<typeof FindAllMyRoomQuerySchema>;

export const FindAllMessageParamSchema = z.object({
  roomId: z.uuid(),
});

export type FindAllMessageDTO = z.infer<typeof FindAllMessageParamSchema>;

export const SendMessageParamSchema = z.object({
  roomId: z.uuid(),
});

export const SendMessageBodySchema = z
  .object({
    contentText: z.string().trim().min(1).optional().nullish(),
    contentImage: z.url().optional().nullish(),
    replyToId: z.uuid().optional().nullish(), // This should be message id
  })
  .superRefine(({ contentImage, contentText }, ctx) => {
    if (!contentImage && !contentText) {
      ctx.addIssue({
        code: "custom",
        message: "required contentText or contentImage to be provided",
        path: ["contentText", "contentImage"],
      });
    }
  });

export type SendMessageDTO = z.infer<
  typeof SendMessageParamSchema & typeof SendMessageBodySchema
>;
