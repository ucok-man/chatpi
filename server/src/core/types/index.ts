import { Session, User } from "better-auth";
import { Context } from "elysia";

export type ContextWithAuth = Context & {
  auth: {
    user: User | null;
    session: Session | null;
  };
};
export type AuthSession = {
  user: User;
  session: Session;
};

export type Headers = Context["headers"];
