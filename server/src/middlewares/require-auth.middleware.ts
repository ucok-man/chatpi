import { Elysia } from "elysia";
import { AuthContext } from "../core/types";

export const requireAuth = () => {
  return new Elysia({ name: "require-auth.middleware" }).derive((ctx) => {
    const { auth } = ctx as AuthContext;
    if (!auth.user || !auth.session) {
      throw ctx.status("Unauthorized");
    }
    return { auth };
  });
};
