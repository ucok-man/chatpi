import { AuthSession } from "@/core/types";
import { PrismaDbClient } from "@/infrastructure/database/prisma/client";
import { User } from "@root/prisma/generated/client";
import { IUserService } from "./user.service.interfaces";

export class UserServicePrisma implements IUserService {
  constructor(private db: PrismaDbClient) {}

  async getAll(
    param: {
      search?: string | null;
      page: number;
      pageSize: number;
    },
    auth: AuthSession
  ): Promise<User[]> {
    const { search, page, pageSize } = param;
    const offset = (page - 1) * pageSize;

    // No search term - return all with pagination
    if (!search || search.trim() === "") {
      return await this.db.client().user.findMany({
        take: pageSize,
        skip: offset,
      });
    }

    // PostgreSQL full-text search
    const searchQuery = search.trim().split(" ").join(":* || ") + ":*";

    return await this.db.client().user.findMany({
      where: {
        OR: [
          {
            name: {
              search: searchQuery,
            },
          },
          {
            email: {
              search: searchQuery,
            },
          },
        ],
      },
      take: pageSize,
      skip: offset,
    });
  }
}
