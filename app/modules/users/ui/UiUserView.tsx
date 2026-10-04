"use client";

import { UiViewField, UiViewSheet, type ViewSheetActions } from "@/components/UiViewSheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

import type { User } from "../type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  actions?: ViewSheetActions;
};

export function UiUserView({ open, onOpenChange, user, actions }: Props) {
  return (
    <UiViewSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle del usuario"
      description="Información de la cuenta."
      empty={user ? undefined : "No se encontró el usuario."}
      actions={actions}
    >
      {user && (
        <>
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback className="bg-brand-100 text-xl font-bold text-brand-700">
                {user.avatar ?? user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.username}</p>
              <Badge variant={user.role.name === "admin" ? "default" : "secondary"} className="mt-1 text-xs">
                {user.role.name}
              </Badge>
            </div>
          </div>
          <UiViewField label="Correo">
            <p>{user.email ?? "—"}</p>
          </UiViewField>
          <UiViewField label="Edad">
            <p>{user.age != null ? `${user.age} años` : "—"}</p>
          </UiViewField>
          <UiViewField label="Alta">
            <p>{formatDateTime(user.created_at)}</p>
          </UiViewField>
        </>
      )}
    </UiViewSheet>
  );
}
