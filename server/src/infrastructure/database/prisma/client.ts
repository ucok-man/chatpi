import { Config } from "@/config";
import { IDatabaseClient } from "@/core/interfaces/database.interfaces";
import { ILogger } from "@/core/interfaces/logger.interfaces";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@root/prisma/generated/client";

export class PrismaDbClient implements IDatabaseClient {
  private db: PrismaClient;
  private connected: boolean = false;

  constructor(private config: Config, private logger: ILogger) {
    const adapter = new PrismaPg({
      connectionString: config.DATABASE_URL,
      max: config.DATABASE_MAX_OPEN_CONN,
      idleTimeoutMillis: config.DATABASE_MAX_IDLE_TIMEOUT * 1000,
      connectionTimeoutMillis: config.DATABASE_MAX_CONNECT_TIMEOUT * 1000,
    });
    this.db = new PrismaClient({ adapter });
  }

  client(): PrismaClient {
    return this.db;
  }

  async connect(): Promise<void> {
    try {
      await this.client().$connect();
      this.connected = true;
      this.logger.info("Prisma database connected successfully");
    } catch (error: any) {
      this.logger.error(error, "Failed to connect to database");
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client().$disconnect();
    this.connected = false;
    this.logger.info("Drizzle database disconnected");
  }

  isConnected(): boolean {
    return this.connected;
  }
}
