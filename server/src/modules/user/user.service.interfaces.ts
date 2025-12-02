import { AuthSession } from "@/core/types";
import { User } from "@root/prisma/generated/client";

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
