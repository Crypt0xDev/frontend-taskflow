import { apiFetch } from "@/lib/api";

import type { ContactValues } from "../schema";

export function serviceContactSend(input: ContactValues) {
  return apiFetch<{ message: string }>("/contact", { method: "POST", body: input });
}
