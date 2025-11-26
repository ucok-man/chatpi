import { Elysia } from "elysia";
import { Auth } from "../../infrastructure/auth/better-auth";
import { AuthController } from "./auth.controller";
import { SignUpSchema } from "./auth.dto";

export const createAuthRoutes = (
  auth: Auth,
  authController: AuthController
) => {
  return new Elysia({ prefix: "/api/auth" })
    .mount("/internal", auth.handler) // NOTE: All error happened will not caught by error handler middleware.
    .post(
      "/sign-up/email",
      ({ body, headers, set }) => {
        set.status = "Created";
        return authController.signup(body, headers);
      },
      {
        body: SignUpSchema,
      }
    );
};
