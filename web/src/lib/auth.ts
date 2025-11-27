import { createAuthClient } from "better-auth/react";

export const auth = createAuthClient({
  basePath: "/api/auth/internal",
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

export const { useSession } = auth;

export type AuthSession = typeof auth.$Infer.Session;
