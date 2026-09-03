"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UiModeToggle } from "@/components/UiModeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, setToken } from "@/lib/api";
import { apiFieldErrors, zodFieldErrors } from "@/lib/form";
import { cn } from "@/lib/utils";
import { AVATARS } from "@/lib/profilePrefs";
import { useSession } from "@/lib/session";
import type { User } from "@/lib/session";
import { registerSchema } from "@/app/modules/auth/schema";
import { serviceAuthRegister } from "@/app/modules/auth/services";
import { serviceProfileUpdate } from "@/app/modules/profile/services/serviceProfileUpdate";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, login: openSession } = useSession();
  const [step, setStep] = useState<1 | 2>(1);
  const [created, setCreated] = useState<{ token: string; user: User } | null>(null);
  const [form, setForm] = useState({ email: "", password: "", password_confirmation: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [step2Error, setStep2Error] = useState<string | undefined>();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function onSubmitStep1(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }

    setSubmitting(true);
    try {
      const { token, user: newUser } = await serviceAuthRegister(parsed.data);
      setCreated({ token, user: newUser });
      setStep(2);
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

  async function finish() {
    if (!created) return;
    setStep2Error(undefined);
    const trimmedName = username.trim();
    if (trimmedName.length < 3) {
      setStep2Error("Elige un nombre de usuario (mínimo 3 caracteres).");
      return;
    }

    setToken(created.token);
    let finalUser = created.user;
    try {
      finalUser = await serviceProfileUpdate({
        user_name: trimmedName,
        birth_date: birthDate || null,
        avatar: avatar ?? null,
      });
    } catch (err) {
      setStep2Error(err instanceof ApiError ? err.message : "No se pudo guardar el perfil.");
      return;
    }

    openSession(created.token, finalUser);
    toast.success(`Cuenta creada. ¡Bienvenido, ${finalUser.username}!`);
    router.replace("/dashboard");
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
              <CardTitle className="text-2xl">Crear cuenta</CardTitle>
              <CardDescription>Paso 1 de 2 · tu correo y una contraseña.</CardDescription>
            </CardHeader>
            <form onSubmit={onSubmitStep1} noValidate>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Repetir contraseña</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={form.password_confirmation}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password_confirmation: e.target.value }))
                    }
                    aria-invalid={!!errors.password_confirmation}
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="mt-6 flex-col gap-3">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Creando…" : "Continuar"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                    Inicia sesión
                  </Link>
                </p>
              </CardFooter>
            </form>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Personaliza tu perfil</CardTitle>
              <CardDescription>Paso 2 de 2 · tu nombre, fecha de nacimiento y avatar (opcional).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="¿Cómo quieres que te llamemos?"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Elige tu avatar</Label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar((prev) => (prev === a ? null : a))}
                      aria-pressed={avatar === a}
                      className={cn(
                        "grid aspect-square place-items-center rounded-lg border text-2xl transition-colors hover:bg-muted",
                        avatar === a ? "border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/40" : "border-input",
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              {step2Error && <p className="text-sm text-destructive">{step2Error}</p>}
            </CardContent>
            <CardFooter className="mt-6 flex-col gap-2">
              <Button type="button" className="w-full" onClick={finish}>
                Finalizar
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </main>
  );
}
