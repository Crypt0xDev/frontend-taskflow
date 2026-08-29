import { apiFetch } from "@/lib/api";

export function serviceUserResetPassword(
  id: number,
  data: { password: string; password_confirmation: string },
) {
  return apiFetch<{ message: string }>(`/admin/users/${id}/password`, {
    method: "PUT",
    body: data,
  });
}
