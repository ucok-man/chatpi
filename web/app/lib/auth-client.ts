import { createAuthClient } from "better-auth/react";

// TODO: change to env
export const authClient = createAuthClient({
  basePath: "/api/auth/internal",
  baseURL: "http://localhost:4000",
});

export const { useSession } = authClient;
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
