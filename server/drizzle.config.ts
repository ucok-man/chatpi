import { config } from "dotenv";
import type { Config } from "drizzle-kit";
config({ path: [".env", ".env.development", ".env.production"] });

export default {
  schema: "./src/infrastructure/database/drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
