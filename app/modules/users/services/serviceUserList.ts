import { apiFetch } from "@/lib/api";
import type { User } from "@/lib/session";

export function serviceUserList() {
  return apiFetch<User[]>("/admin/users");
}
