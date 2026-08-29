import { apiFetch } from "@/lib/api";

import type { Role } from "../type/typeRoleBase";

export function serviceRoleList() {
  return apiFetch<Role[]>("/admin/roles");
}
