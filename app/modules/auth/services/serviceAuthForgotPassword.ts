import { apiFetch } from "@/lib/api";

import type { ForgotPasswordValues } from "../schema";

export function serviceAuthForgotPassword(input: ForgotPasswordValues) {
  return apiFetch<{ message: string }>("/password/forgot", { method: "POST", body: input });
}
