"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { UiModeToggle } from "@/components/UiModeToggle";
import { UiLoadingSpinner } from "@/components/UiLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/session";
import type { User } from "@/lib/session";

const COPY: Record<string, { title: string; description: string }> = {
  verified: {
    title: "¡Correo verificado!",
    description: "Tu cuenta ya está activa. Puedes continuar usando TaskFlow.",
  },
  "already-verified": {
    title: "Ya estaba verificado",
    description: "Tu correo ya había sido confirmado antes.",
  },
  invalid: {
    title: "Enlace inválido o expirado",
    description: "Solicita un nuevo correo de verificación desde tu cuenta.",
  },
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-4">
          <UiLoadingSpinner />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

// `useSearchParams` obliga a envolver en Suspense para no bloquear el
// prerender estático del resto de la página (ver Next.js docs).
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateUser } = useSession();
  const status = searchParams.get("status") ?? "invalid";
  const copy = COPY[status] ?? COPY.invalid;
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    if (status !== "verified" && status !== "already-verified") return;
    apiFetch<User>("/me")
      .then((me) => updateUser({ email_verified: me.email_verified }))
      .finally(() => setRefreshed(true));
  }, [status, updateUser]);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 p-4">
      <UiModeToggle className="absolute right-4 top-4" />
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <Button
              type="button"
              className="w-full"
              disabled={(status === "verified" || status === "already-verified") && !refreshed}
              onClick={() => router.replace("/dashboard")}
            >
              Ir a mi panel
            </Button>
          ) : (
            <Button type="button" className="w-full" onClick={() => router.replace("/login")}>
              Iniciar sesión
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
