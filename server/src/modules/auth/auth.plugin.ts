import { Auth } from "@/infrastructure/auth/better-auth";
import { Elysia } from "elysia";

export const createAuthPlugin = (auth: Auth) => {
  return new Elysia({ name: "auth.plugin" }).derive(async ({ headers }) => {
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
    } catch (err) {}

    return {
      auth: {
        user: null,
        session: null,
      },
    };
  });
};
