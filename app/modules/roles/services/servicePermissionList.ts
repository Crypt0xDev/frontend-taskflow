import { apiFetchList } from "@/lib/api";

import type { Permission } from "../type/typeRoleBase";

export function servicePermissionList() {
  return apiFetchList<Permission>("/admin/permissions");
}
