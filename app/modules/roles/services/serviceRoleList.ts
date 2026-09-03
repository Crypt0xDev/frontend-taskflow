import { apiFetchList } from "@/lib/api";

import type { Role } from "../type/typeRoleBase";

export function serviceRoleList() {
  return apiFetchList<Role>("/admin/roles");
}
