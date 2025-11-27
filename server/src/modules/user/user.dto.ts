import z from "zod";

export const GetAllUserSchema = z.object({
  search: z.string().optional().nullish().default(""),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetAllUserDTO = z.infer<typeof GetAllUserSchema>;
