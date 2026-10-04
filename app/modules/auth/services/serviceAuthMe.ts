import { apiFetch } from "@/lib/api";
import type { User } from "@/lib/session";

export function serviceAuthMe() {
  return apiFetch<User>("/me");
}
