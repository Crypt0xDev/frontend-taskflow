"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";

import { serviceProfilePassword } from "../services/serviceProfilePassword";
import { serviceProfileUpdate } from "../services/serviceProfileUpdate";

export function UiForcePasswordChange() {
  const { user, updateUser, logout } = useSession();
  const initialName = user?.username && !user.username.includes("@") ? user.username : "";
  const [username, setUsername] = useState(initialName);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const trimmedName = username.trim();
    if (trimmedName.length > 0 && trimmedName.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }
    if (next.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (next !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    try {
      let nextUsername: string | undefined;
      if (trimmedName.length >= 3) {
        const updated = await serviceProfileUpdate({ user_name: trimmedName });
        nextUsername = updated?.username ?? trimmedName;
      }
      await serviceProfilePassword({
        current_password: current,
        password: next,
        password_confirmation: confirm,
      });
      updateUser({ ...(nextUsername ? { username: nextUsername } : {}), must_change_password: false });
      toast.success("¡Todo listo! Bienvenido.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo completar la configuración.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Configura tu cuenta</CardTitle>
          <CardDescription>
            Tu cuenta usa credenciales temporales. Elige tu nombre de usuario y una contraseña
            nueva para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} noValidate className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fc-username">Nombre de usuario (opcional)</Label>
              <Input
                id="fc-username"
                autoComplete="username"
                placeholder="Tu nombre visible"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Es solo tu nombre visible. Inicias sesión con tu correo.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fc-current">Contraseña temporal</Label>
              <Input
                id="fc-current"
                type="password"
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fc-next">Nueva contraseña</Label>
              <Input
                id="fc-next"
                type="password"
                autoComplete="new-password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fc-confirm">Confirmar contraseña</Label>
              <Input
                id="fc-confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Guardando…" : "Guardar y continuar"}
            </Button>
            <button
              type="button"
              onClick={() => logout()}
              className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Cerrar sesión
            </button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
