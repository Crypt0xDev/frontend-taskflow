"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { UiLoadingSpinner } from "@/components/UiLoading";
import { useSession } from "@/lib/session";

import { useAuthLogin } from "./hooks";
import type { LoginValues } from "./schema";
import { UiAuthShell } from "./ui/UiAuthShell";
import { UiLoginForm } from "./ui/UiLoginForm";

export default function UiLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-4">
          <UiLoadingSpinner />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function safeRedirectPath(next: string | null): string | null {
  if (!next) return null;
  try {
    const url = new URL(next, window.location.origin);
    return url.origin === window.location.origin ? `${url.pathname}${url.search}${url.hash}` : null;
  } catch {
    return null;
  }
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useSession();
  const { login } = useAuthLogin();

  const redirectTarget = safeRedirectPath(searchParams.get("next"));

  useEffect(() => {
    if (!loading && user) router.replace(redirectTarget ?? "/dashboard");
  }, [loading, user, router, redirectTarget]);

  async function handleSubmit(values: LoginValues) {
    const signedIn = await login(values);
    router.replace(redirectTarget ?? (signedIn.role.name === "admin" ? "/admin" : "/dashboard"));
  }

  return (
    <UiAuthShell>
      <UiLoginForm onSubmit={handleSubmit} />
    </UiAuthShell>
  );
}
