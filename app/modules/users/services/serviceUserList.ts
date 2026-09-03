import { apiFetchList } from "@/lib/api";

import type { User } from "../type/typeUserBase";

export function serviceUserList() {
  return apiFetchList<User>("/admin/users");
}
