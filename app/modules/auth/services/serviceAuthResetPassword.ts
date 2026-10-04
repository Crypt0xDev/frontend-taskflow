import { apiFetch } from "@/lib/api";

import type { ResetPasswordValues } from "../schema";

export function serviceAuthResetPassword(input: ResetPasswordValues) {
  return apiFetch<{ message: string }>("/password/reset", { method: "POST", body: input });
}
