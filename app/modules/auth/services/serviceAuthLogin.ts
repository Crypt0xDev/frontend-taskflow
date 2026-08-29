import { apiFetch } from "@/lib/api";

import type { AuthResponse, Credentials } from "../type/typeAuthBase";

export function serviceAuthLogin(credentials: Credentials) {
  return apiFetch<AuthResponse>("/login", { method: "POST", body: credentials });
}
