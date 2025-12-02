import z from "zod";

const schema = z.object({
  VERSION: z.string().default("1.0.0"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default(4000),
  DATABASE_PROVIDER: z.enum(["prisma"]),
  DATABASE_URL: z.url(),
  DATABASE_MAX_OPEN_CONN: z.number().positive().max(80).default(25),
  DATABASE_MAX_IDLE_TIMEOUT: z.number().positive().default(15),
  DATABASE_MAX_CONNECT_TIMEOUT: z.number().positive().default(15),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export type Config = z.infer<typeof schema>;

export const createConfig = (): Config => {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      z.treeifyError(parsed.error)
    );
    throw new Error("Invalid environment configuration");
  }

  return parsed.data;
};
