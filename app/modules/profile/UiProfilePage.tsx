"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UiHeaderModule } from "@/components/UiHeaderModule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, deferMicrotask } from "@/lib/utils";
import { AVATARS } from "@/config/constants";
import { ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";

import { serviceProfileUpdate } from "./services/serviceProfileUpdate";
import { useProfilePasswordUpdate } from "./hooks/useProfilePasswordUpdate";
import { useProfileUpdate } from "./hooks/useProfileUpdate";
import { UiProfileDeleteCard } from "./ui/UiProfileDeleteCard";

export default function UiProfilePage() {
  const { user, updateUser } = useSession();
  const profile = useProfileUpdate();
  const password = useProfilePasswordUpdate();

  const [birthDate, setBirthDate] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    if (!user) return;
    deferMicrotask(() => {
      setBirthDate(user.birth_date ?? "");
      setAvatar(user.avatar ?? null);
    });
  }, [user]);

  async function savePrefs() {
    if (!user) return;
    setSavingPrefs(true);
    try {
      const updated = await serviceProfileUpdate({
        birth_date: birthDate || null,
        avatar: avatar ?? null,
      });
      updateUser({
        birth_date: updated?.birth_date ?? null,
        age: updated?.age ?? null,
        avatar: updated?.avatar ?? null,
      });
      toast.success("Preferencias guardadas.");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudieron guardar.");
    } finally {
      setSavingPrefs(false);
    }
  }

  return (
    <div className="space-y-4">
      <UiHeaderModule title="Mi perfil" description="Gestiona tu cuenta y tu contraseña." />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Account data */}
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle className="font-display">Datos de la cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profile.form}>
              <form onSubmit={profile.submit} noValidate className="space-y-4">
                <FormField
                  control={profile.form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de usuario</FormLabel>
                      <FormControl>
                        <Input autoComplete="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profile.form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {profile.emailChanged && (
                  <FormField
                    control={profile.form.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña actual</FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="current-password" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Para cambiar el correo confirma tu contraseña. Tendrás que verificar el nuevo correo.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Rol</p>
                  <p className="text-sm font-medium">
                    {user?.role.name ?? "—"}
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={profile.submitting}>
                    {profile.submitting ? "Guardando…" : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Password */}
        <Card className="animate-fade-up animate-delay-50">
          <CardHeader>
            <CardTitle className="font-display">Cambiar contraseña</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...password.form}>
              <form onSubmit={password.submit} noValidate className="space-y-4">
                <FormField
                  control={password.form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña actual</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="current-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={password.form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={password.form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={password.submitting}>
                    {password.submitting ? "Guardando…" : "Cambiar contraseña"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Cosmetic preferences (client-side): age + avatar */}
      <Card className="animate-fade-up animate-delay-100">
        <CardHeader>
          <CardTitle className="font-display">Preferencias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-2 sm:max-w-xs">
            <Label htmlFor="pref-birth">Fecha de nacimiento</Label>
            <Input
              id="pref-birth"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            {user?.age != null && (
              <p className="text-xs text-muted-foreground">Edad: {user.age} años</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Avatar</Label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar((prev) => (prev === a ? null : a))}
                  aria-pressed={avatar === a}
                  className={cn(
                    "grid size-11 place-items-center rounded-lg border text-2xl transition-colors hover:bg-muted",
                    avatar === a ? "border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/40" : "border-input",
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={savePrefs} disabled={savingPrefs}>
              {savingPrefs ? "Guardando…" : "Guardar preferencias"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <UiProfileDeleteCard />
    </div>
  );
}
