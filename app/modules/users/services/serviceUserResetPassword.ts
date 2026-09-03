import { apiFetch } from "@/lib/api";

import type { UserResetPasswordInput } from "../type/typeUserResetPassword";

export function serviceUserResetPassword(id: number, data: UserResetPasswordInput) {
  return apiFetch<{ message: string }>(`/admin/users/${id}/password`, {
    method: "PUT",
    body: data,
  });
}
