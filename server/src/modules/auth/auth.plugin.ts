import { AuthInstance } from "@/infrastructure/auth/better-auth";
import { ErrInternalServer } from "@/utility/http-errors";
import { Elysia } from "elysia";

export const createAuthPlugin = (auth: AuthInstance) => {
  return new Elysia({ name: "auth.plugin" })
    .derive(async ({ headers }) => {
      try {
        const session = await auth.api.getSession({
          headers: headers as any,
        });

        if (session) {
          return {
            auth: {
              user: session.user,
              session: session.session,
            },
          };
        }
      } catch (err: any) {
        throw new ErrInternalServer(err);
      }

      return {
        auth: {
          user: null,
          session: null,
        },
      };
    })
    .as("global");
};
