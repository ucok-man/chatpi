import { AuthSession } from "@/core/types";
import { User } from "@/infrastructure/database/drizzle/schema";

export interface IUserService {
  getAll(
    param: {
      search?: string | null;
      page: number;
      pageSize: number;
    },
    auth: AuthSession
  ): Promise<User[]>;
}
