import { z } from "zod";

const schema = z.object({
  port: z.number().default(4000),
  env: z.enum(["development", "production", "test"]).default("development"),
  database: z.object({
    url: z.url(),
  }),
});

export type ConfigType = z.infer<typeof schema>;

export namespace Config {
  export const load = (): ConfigType => {
    const { success, error, data } = schema.safeParse({
      port: parseInt(process.env.PORT ?? "4000", 10),
      env: process.env.NODE_ENV ?? "development",
      database: {
        url: process.env.DATABASE_URL,
      },
    });
    if (!success) {
      throw new Error(`Configuration validation failed: ${error.message}`);
    }
    return data;
  };
}
