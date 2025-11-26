import { Session, User } from "better-auth";
import { Context } from "elysia";

export type AuthContext = Context & {
  auth: {
    user: User | null;
    session: Session | null;
  };
};

export type Headers = Context["headers"];
