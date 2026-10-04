"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { UiModeToggle } from "@/components/UiModeToggle";
import { UiLoadingSpinner } from "@/components/UiLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { apiFieldErrors, zodFieldErrors } from "@/lib/form";
import { useSession } from "@/lib/session";
import { loginSchema } from "@/app/modules/auth/schema";
import { serviceAuthLogin } from "@/app/modules/auth/services";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-4">
          <UiLoadingSpinner />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

// `useSearchParams` obliga a envolver en Suspense para no bloquear el
// prerender estático del resto de la página (ver Next.js docs).
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login: openSession } = useSession();

  // Ruta a la que se intentaba acceder antes de que middleware.ts redirigiera
  // a /login (ver middleware.ts: `?next=`). Solo se acepta una ruta interna.
  const nextPath = searchParams.get("next");
  const redirectTarget = nextPath?.startsWith("/") ? nextPath : null;

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace(redirectTarget ?? "/dashboard");
  }, [loading, user, router, redirectTarget]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      return;
    }

    setSubmitting(true);
    try {
      const { token, user: signedIn } = await serviceAuthLogin(parsed.data);
      openSession(token, signedIn);
      toast.success(`Hola de nuevo, ${signedIn.username}`);
      router.replace(redirectTarget ?? (signedIn.role.name === "admin" ? "/admin" : "/dashboard"));
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
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>Entra con tu correo y contraseña.</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} noValidate>
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
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="mt-6 flex-col gap-3">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Entrando…" : "Entrar"}
            </Button>
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
                Regístrate
              </Link>
            </p>
            <p className="text-center text-xs text-muted-foreground">
              ¿Olvidaste tu contraseña?{" "}
              <Link href="/forgot-password" className="font-medium text-foreground underline-offset-4 hover:underline">
                Recupérala
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
