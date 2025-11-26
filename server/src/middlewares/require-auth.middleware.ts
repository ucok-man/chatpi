import { AuthSession, ContextWithAuth } from "@/core/types";
import { Elysia } from "elysia";

export const requireAuth = () => {
  return new Elysia({ name: "require-auth.middleware" })
    .derive((ctx) => {
      const { auth } = ctx as ContextWithAuth;
      if (!auth.user || !auth.session) {
        throw ctx.status("Unauthorized");
      }

      return { auth: { ...auth } as unknown as AuthSession };
    })
    .as("scoped");
};
