"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { UiLoadingSpinner } from "@/components/UiLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/session";

import { useAuthEmailVerify, type VerificationStatus } from "./hooks";
import { UiAuthShell } from "./ui/UiAuthShell";

const COPY: Record<VerificationStatus, { title: string; description: string }> = {
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

function toStatus(value: string | null): VerificationStatus {
  return value === "verified" || value === "already-verified" ? value : "invalid";
}

export default function UiEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-4">
          <UiLoadingSpinner />
        </div>
      }
    >
      <EmailContent />
    </Suspense>
  );
}

function EmailContent() {
  const router = useRouter();
  const { user } = useSession();
  const status = toStatus(useSearchParams().get("status"));
  const { ready } = useAuthEmailVerify(status);
  const copy = COPY[status];

  return (
    <UiAuthShell brand={false}>
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <Button type="button" className="w-full" disabled={!ready} onClick={() => router.replace("/dashboard")}>
              Ir a mi panel
            </Button>
          ) : (
            <Button type="button" className="w-full" onClick={() => router.replace("/login")}>
              Iniciar sesión
            </Button>
          )}
        </CardContent>
      </Card>
    </UiAuthShell>
  );
}
