"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { UiModeToggle } from "@/components/UiModeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { apiFieldErrors, zodFieldErrors } from "@/lib/form";
import { forgotPasswordSchema, resetPasswordSchema } from "@/app/modules/auth/schema";
import { serviceAuthForgotPassword, serviceAuthResetPassword } from "@/app/modules/auth/services";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }

    setSubmitting(true);
    try {
      await serviceAuthForgotPassword(parsed.data.email);
      toast.success("Si el correo existe, te enviamos un código.");
      setStep(2);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const parsed = resetPasswordSchema.safeParse({
      email,
      code,
      password,
      password_confirmation: passwordConfirmation,
    });
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }

    setSubmitting(true);
    try {
      await serviceAuthResetPassword(parsed.data);
      toast.success("Contraseña restablecida. Ya puedes iniciar sesión.");
      router.replace("/login");
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(apiFieldErrors(error.errors));
      } else {
        toast.error(error instanceof ApiError ? error.message : "Error inesperado.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 p-4">
      <UiModeToggle className="absolute right-4 top-4" />
      <Link href="/" className="flex items-center gap-2.5">
        <span className="grid size-8 -rotate-6 place-items-center rounded-xl bg-brand-500 text-white shadow-brand">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </span>
        <span className="font-display text-lg font-bold tracking-tight">TaskFlow</span>
      </Link>
      <Card className="w-full max-w-sm">
        {step === 1 ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
              <CardDescription>Te enviaremos un código de 6 dígitos a tu correo.</CardDescription>
            </CardHeader>
            <form onSubmit={requestCode} noValidate>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fp-email">Correo</Label>
                  <Input
                    id="fp-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </CardContent>
              <CardFooter className="mt-6 flex-col gap-3">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Enviando…" : "Enviar código"}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Ya tengo un código
                </button>
              </CardFooter>
            </form>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Ingresa el código</CardTitle>
              <CardDescription>Revisa tu correo y escribe el código junto a tu nueva contraseña.</CardDescription>
            </CardHeader>
            <form onSubmit={submitReset} noValidate>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fp-email-2">Correo</Label>
                  <Input
                    id="fp-email-2"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fp-code">Código</Label>
                  <Input
                    id="fp-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    aria-invalid={!!errors.code}
                  />
                  {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fp-password">Nueva contraseña</Label>
                  <Input
                    id="fp-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fp-password-confirmation">Confirmar contraseña</Label>
                  <Input
                    id="fp-password-confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    aria-invalid={!!errors.password_confirmation}
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="mt-6 flex-col gap-3">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Restableciendo…" : "Restablecer contraseña"}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Reenviar código
                </button>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </main>
  );
}
