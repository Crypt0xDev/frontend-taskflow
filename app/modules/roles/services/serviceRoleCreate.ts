import { apiFetch } from "@/lib/api";

import type { Role } from "../type/typeRoleBase";

export type RoleInput = {
  name: string;
  description: string | null;
  permission_ids: number[];
};

export function serviceRoleCreate(data: RoleInput) {
  return apiFetch<Role>("/admin/roles", { method: "POST", body: data });
}
