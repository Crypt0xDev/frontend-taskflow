"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthPasswordReset } from "./hooks";
import type { ForgotPasswordValues, ResetPasswordValues } from "./schema";
import { UiAuthShell } from "./ui/UiAuthShell";
import { UiPasswordRequestForm } from "./ui/UiPasswordRequestForm";
import { UiPasswordResetForm } from "./ui/UiPasswordResetForm";

export default function UiPasswordResetPage() {
  const router = useRouter();
  const { requestCode, resetPassword } = useAuthPasswordReset();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");

  function goTo(next: "request" | "reset", currentEmail: string) {
    setEmail(currentEmail);
    setStep(next);
  }

  async function handleRequest(values: ForgotPasswordValues) {
    await requestCode(values);
    goTo("reset", values.email);
  }

  async function handleReset(values: ResetPasswordValues) {
    await resetPassword(values);
    router.replace("/login");
  }

  return (
    <UiAuthShell>
      {step === "request" ? (
        <UiPasswordRequestForm
          defaultEmail={email}
          onSubmit={handleRequest}
          onHaveCode={(current) => goTo("reset", current)}
        />
      ) : (
        <UiPasswordResetForm
          defaultEmail={email}
          onSubmit={handleReset}
          onResend={(current) => goTo("request", current)}
        />
      )}
    </UiAuthShell>
  );
}
