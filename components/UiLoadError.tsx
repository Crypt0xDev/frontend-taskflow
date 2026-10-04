"use client";

import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  message?: string;
  onRetry: () => void;
};

export function UiLoadError({ message = "No se pudo cargar la información.", onRetry }: Props) {
  return (
    <div role="alert" className="animate-fade-up rounded-md border p-8 text-center">
      <p className="font-medium">{message}</p>
      <p className="mt-1 text-sm text-muted-foreground">Revisa tu conexión e intenta de nuevo.</p>
      <Button variant="outline" className="mt-4" onClick={onRetry}>
        <RotateCw className="size-4" />
        Reintentar
      </Button>
    </div>
  );
}
