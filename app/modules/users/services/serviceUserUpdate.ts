import { apiFetch } from "@/lib/api";
import type { Role, User } from "@/lib/session";

export function serviceUserUpdate(
  id: number,
  data: { user_name?: string; email?: string; role?: Role },
) {
  return apiFetch<User>(`/admin/users/${id}`, { method: "PUT", body: data });
}
