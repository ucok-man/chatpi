import * as schema from "@/infrastructure/database/drizzle/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { reset } from "drizzle-seed";
import postgres from "postgres";

const queryClient = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(queryClient, { schema });

async function main() {
  console.log("🔄 Resetting database...");
  await reset(db, schema);
  console.log("✅ Database reset complete.");
}

main()
  .catch((err) => {
    console.error("❌ ERROR: Reset DB failed");
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await queryClient.end();
  });
