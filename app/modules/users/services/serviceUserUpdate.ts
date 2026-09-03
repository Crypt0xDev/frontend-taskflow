import { apiFetch } from "@/lib/api";

import type { User } from "../type/typeUserBase";
import type { UserUpdateInput } from "../type/typeUserUpdate";

export function serviceUserUpdate(id: number, data: UserUpdateInput) {
  return apiFetch<User>(`/admin/users/${id}`, { method: "PUT", body: data });
}
