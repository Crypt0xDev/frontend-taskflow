import type { ZodError } from "zod";

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
