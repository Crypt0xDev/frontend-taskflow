"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";

export function UiEmailVerifyNotice() {
  const { user, logout, resendVerificationEmail } = useSession();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function resend() {
    setSending(true);
    try {
      await resendVerificationEmail();
      setSent(true);
      toast.success("Correo de verificación enviado.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo enviar el correo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Verifica tu correo</CardTitle>
          <CardDescription>
            Enviamos un enlace de verificación a <strong>{user?.email}</strong>. Ábrelo para
            activar tu cuenta y continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" className="w-full" onClick={resend} disabled={sending || sent}>
            {sending ? "Enviando…" : sent ? "Correo reenviado" : "Reenviar correo"}
          </Button>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Cerrar sesión
          </button>
        </CardContent>
      </Card>
    </main>
  );
}
