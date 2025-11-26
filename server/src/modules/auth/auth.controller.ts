import { APIError } from "better-auth/api";
import { Headers } from "../../core/types";
import { Auth } from "../../infrastructure/auth/better-auth";
import {
  ErrInternalServer,
  ErrUnauthorized,
  ErrUnprocessableEntity,
} from "../../utility/http-errors";
import { SignInDTO, SignUpDTO } from "./auth.dto";

export class AuthController {
  constructor(private auth: Auth) {}

  async signup(dto: SignUpDTO, headers: Headers) {
    try {
      return await this.auth.api.signUpEmail({
        headers: headers as any,
        body: {
          name: dto.name,
          email: dto.email,
          password: dto.password,
        },
      });
    } catch (error: any) {
      if (
        error instanceof APIError &&
        error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
      ) {
        throw ErrUnprocessableEntity.construct([
          {
            path: "email",
            message: error.body.message ?? "email already exists",
          },
        ]);
      }
      throw new ErrInternalServer(error);
    }
  }

  async signin(dto: SignInDTO, headers: Headers) {
    try {
      return await this.auth.api.signInEmail({
        headers: headers as any,
        body: {
          email: dto.email,
          password: dto.password,
        },
        returnHeaders: true,
      });
    } catch (error: any) {
      if (
        error instanceof APIError &&
        error.body?.code === "INVALID_EMAIL_OR_PASSWORD"
      ) {
        throw new ErrUnauthorized(
          error.body.message ?? "Invalid email or password"
        );
      }
      throw new ErrInternalServer(error);
    }
  }
}
