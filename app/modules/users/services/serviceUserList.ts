import { apiFetchAllPages } from "@/lib/api";

import type { User } from "../type/typeUserBase";

export function serviceUserList() {
  return apiFetchAllPages<User>("/admin/users");
}
