import { apiFetch } from "@/lib/api";
import type { User } from "@/lib/session";

export function serviceProfileUpdate(data: {
  user_name?: string;
  email?: string;
  current_password?: string;
  birth_date?: string | null;
  avatar?: string | null;
}) {
  return apiFetch<User>("/me", { method: "PUT", body: data });
}
