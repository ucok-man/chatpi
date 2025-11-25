import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Config } from "../../../config";
import { IDatabaseClient } from "../../../core/interfaces/database.interfaces";
import { ILogger } from "../../../core/interfaces/logger.interfaces";
import * as schema from "./schema";

export class DrizzleClient implements IDatabaseClient {
  private queryClient: postgres.Sql;
  private db: PostgresJsDatabase<typeof schema> & { $client: postgres.Sql };
  private connected: boolean = false;

  constructor(private config: Config, private logger: ILogger) {
    this.queryClient = postgres(config.DATABASE_URL, {
      max: config.DATABASE_MAX_OPEN_CONN,
      idle_timeout: config.DATABASE_MAX_IDLE_TIMEOUT,
      connect_timeout: config.DATABASE_MAX_CONNECT_TIMEOUT,
    });

    this.db = drizzle({ client: this.queryClient, schema: schema });
  }

  client(): PostgresJsDatabase<typeof schema> {
    return this.db;
  }

  query(): postgres.Sql {
    return this.queryClient;
  }

  async connect(): Promise<void> {
    try {
      await this.queryClient`SELECT 1`;
      this.connected = true;
      this.logger.info("Drizzle database connected successfully");
    } catch (error) {
      this.logger.error({ error }, "Failed to connect to database");
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.queryClient.end();
    this.connected = false;
    this.logger.info("Drizzle database disconnected");
  }

  isConnected(): boolean {
    return this.connected;
  }
}
