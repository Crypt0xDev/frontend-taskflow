import { apiFetch } from "@/lib/api";
import type { Role, User } from "@/lib/session";

export function serviceUserCreate(data: {
  email: string;
  user_name?: string | null;
  password: string;
  role: Role;
}) {
  return apiFetch<User>("/admin/users", { method: "POST", body: data });
}
