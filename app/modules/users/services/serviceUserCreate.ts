import { apiFetch } from "@/lib/api";

import type { User } from "../type/typeUserBase";
import type { UserCreateInput } from "../type/typeUserCreate";

export function serviceUserCreate(data: UserCreateInput) {
  return apiFetch<User>("/admin/users", { method: "POST", body: data });
}
