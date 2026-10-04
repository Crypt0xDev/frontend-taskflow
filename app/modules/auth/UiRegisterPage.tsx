"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useSession } from "@/lib/session";

import { useAuthRegister } from "./hooks";
import type { RegisterProfileValues, RegisterValues } from "./schema";
import type { AuthResponse } from "./type";
import { UiAuthShell } from "./ui/UiAuthShell";
import { UiRegisterForm } from "./ui/UiRegisterForm";
import { UiRegisterProfileForm } from "./ui/UiRegisterProfileForm";

export default function UiRegisterPage() {
  const router = useRouter();
  const { user, loading } = useSession();
  const { register, finish } = useAuthRegister();
  const [created, setCreated] = useState<AuthResponse | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function handleAccount(values: RegisterValues) {
    setCreated(await register(values));
  }

  async function handleProfile(values: RegisterProfileValues) {
    if (!created) return;
    await finish(created, values);
    router.replace("/dashboard");
  }

  return (
    <UiAuthShell>
      {created ? (
        <UiRegisterProfileForm onSubmit={handleProfile} />
      ) : (
        <UiRegisterForm onSubmit={handleAccount} />
      )}
    </UiAuthShell>
  );
}
