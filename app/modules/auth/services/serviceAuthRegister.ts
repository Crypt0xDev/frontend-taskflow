import { apiFetch } from "@/lib/api";

import type { AuthResponse, RegisterInput } from "../type/typeAuthBase";

export function serviceAuthRegister(input: RegisterInput) {
  return apiFetch<AuthResponse>("/register", { method: "POST", body: input });
}
