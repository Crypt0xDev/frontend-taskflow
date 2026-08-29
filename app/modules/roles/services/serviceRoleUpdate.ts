import { apiFetch } from "@/lib/api";

import type { Role } from "../type/typeRoleBase";
import type { RoleInput } from "./serviceRoleCreate";

export function serviceRoleUpdate(id: number, data: RoleInput) {
  return apiFetch<Role>(`/admin/roles/${id}`, { method: "PUT", body: data });
}
