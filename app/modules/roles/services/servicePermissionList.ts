import { apiFetch } from "@/lib/api";

import type { Permission } from "../type/typeRoleBase";

export function servicePermissionList() {
  return apiFetch<Permission[]>("/admin/permissions");
}
