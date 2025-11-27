import { AuthSession } from "@/core/types";
import { DrizzleClient } from "@/infrastructure/database/drizzle/drizzle.client";
import { user, User } from "@/infrastructure/database/drizzle/schema";
import { and, asc, ne, sql } from "drizzle-orm";
import { IUserService } from "./user.service.interfaces";

export class UserServiceDrizzle implements IUserService {
  constructor(private db: DrizzleClient) {}

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
      return await this.db
        .client()
        .select()
        .from(user)
        .where(ne(user.id, auth.user.id))
        .orderBy(asc(user.name))
        .limit(pageSize)
        .offset(offset);
    }

    // PostgreSQL full-text search
    const searchQuery = search.trim().split(" ").join(":* || ") + ":*";
    console.log({ searchQuery });

    const result = await this.db
      .client()
      .select()
      .from(user)
      .where(
        and(
          sql`to_tsvector('simple', ${user.name} || ' ' || ${user.email}) @@ to_tsquery('simple', ${searchQuery})`,
          ne(user.id, auth.user.id)
        )
      )
      .orderBy(asc(user.name))
      .limit(pageSize)
      .offset(offset);

    return result;
  }
}
