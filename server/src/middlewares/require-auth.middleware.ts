import { AuthSession, ContextWithAuth } from "@/core/types";
import { ErrUnauthorized } from "@/utility/http-errors";
import { Elysia } from "elysia";

export const requireAuth = () => {
  return new Elysia({ name: "require-auth.middleware" })
    .derive((ctx) => {
      const { auth } = ctx as ContextWithAuth;
      if (!auth?.user || !auth?.session) {
        throw new ErrUnauthorized(
          "this resources require credential to be accessed"
        );
      }

      return { auth: { ...auth } as unknown as AuthSession };
    })
    .as("scoped");
};
