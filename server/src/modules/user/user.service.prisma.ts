import { AuthSession, Metadata } from "@/core/types";
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
  ): Promise<{ users: User[]; meta: Metadata }> {
    const { search, page, pageSize } = param;
    const offset = (page - 1) * pageSize;

    // No search term - return all with pagination
    if (!search || search.trim() === "") {
      const users = await this.db.client().user.findMany({
        take: pageSize,
        skip: offset,
      });
      const count = await this.db.client().user.count({});

      const lastPage = Math.ceil(count / pageSize);
      const nextPage = page < lastPage ? page + 1 : null;

      return {
        users: users,
        meta: {
          total: count,
          pageSize: pageSize,
          currentPage: page,
          nextPage: nextPage,
          lastPage: lastPage,
        },
      };
    }

    // PostgreSQL full-text search
    const searchQuery = search.trim().split(" ").join(":* || ") + ":*";

    const users = await this.db.client().user.findMany({
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

    const count = await this.db.client().user.count({
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
    });

    const lastPage = Math.ceil(count / pageSize);
    const nextPage = page < lastPage ? page + 1 : null;

    return {
      users: users,
      meta: {
        total: count,
        pageSize: pageSize,
        currentPage: page,
        nextPage: nextPage,
        lastPage: lastPage,
      },
    };
  }
}
