import { Elysia } from "elysia";
import z from "zod";
import { Auth } from "../../infrastructure/auth/better-auth";

export const createAuthRoutes = (auth: Auth) => {
  return new Elysia({ prefix: "/api/auth" })
    .mount("/internal", auth.handler) // NOTE: All error happened on handler will not caught by error handler middleware.
    .post(
      "/sign-up/email",
      ({ body, headers, cookie }) => {
        return { body };
      },
      {
        body: z.object({
          name: z
            .string()
            .trim()
            .min(1, "name is required")
            .max(255, "name max of 255 char long"),
          email: z.email(),
          password: z.string(),
        }),
      }
    );
};
