import { AuthInstance } from "@/infrastructure/auth/better-auth";
import { Elysia } from "elysia";
import { StatusCodes } from "http-status-codes";
import { AuthController } from "./auth.controller";
import { SignInSchema, SignUpSchema } from "./auth.dto";

export const createAuthRoutes = (
  auth: AuthInstance,
  authController: AuthController
) => {
  return new Elysia({ prefix: "/api/auth" })
    .mount("/internal", auth.handler) // NOTE: All error happened will not caught by error handler middleware.
    .post(
      "/sign-up/email",
      async ({ body, headers, set }) => {
        set.status = StatusCodes.CREATED;
        return await authController.signup(body, headers);
      },
      {
        body: SignUpSchema,
      }
    )
    .post(
      "/sign-in/email",
      async ({ body, headers, set }) => {
        set.status = StatusCodes.OK;
        const { response, headers: meta } = await authController.signin(
          body,
          headers
        );

        meta.forEach((value, key) => {
          set.headers[key] = value;
        });

        return response;
      },
      {
        body: SignInSchema,
      }
    )
    .post("/sign-out", async ({ headers, set }) => {
      set.status = StatusCodes.OK;
      // NOTE: if you customize your cookie on name. This should mirror on it.
      set.headers["set-cookie"] =
        "better-auth.session_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax";

      return await authController.signout(headers);
    });
};
