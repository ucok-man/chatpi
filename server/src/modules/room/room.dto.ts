import z from "zod";

export const CreateRoomSchema = z
  .object({
    participantIds: z.array(z.uuid()).nonempty(),
    isGroup: z.boolean(),
    groupName: z.string().nullish(),
  })
  .superRefine((data, ctx) => {
    if (data.isGroup && !data.groupName) {
      ctx.addIssue({
        code: "custom",
        message: "Group name is required when creating a group room",
        path: ["groupName"],
      });
    }
  });

export type CreateRoomDTO = z.infer<typeof CreateRoomSchema>;
