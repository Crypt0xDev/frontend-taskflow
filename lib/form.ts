import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import type { ZodError } from "zod";

import { ApiError } from "@/lib/api";

export function zodFieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export function apiFieldErrors(errors: Record<string, string[]>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, messages] of Object.entries(errors)) {
    if (messages?.length) out[key] = messages[0];
  }
  return out;
}

export function setFormApiErrors<T extends FieldValues>(form: UseFormReturn<T>, error: unknown): boolean {
  if (!(error instanceof ApiError) || !error.errors) return false;
  for (const [name, message] of Object.entries(apiFieldErrors(error.errors))) {
    form.setError(name as Path<T>, { message });
  }
  return true;
}
