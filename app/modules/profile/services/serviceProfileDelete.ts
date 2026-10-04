import { apiFetch } from "@/lib/api";

import type { DeleteAccountValues } from "../schema";

export function serviceProfileDelete(input: DeleteAccountValues) {
  return apiFetch<{ message: string }>("/me", { method: "DELETE", body: input });
}
