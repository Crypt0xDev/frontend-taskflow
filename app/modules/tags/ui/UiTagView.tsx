"use client";

import { UiViewField, UiViewSheet, type ViewSheetActions } from "@/components/UiViewSheet";

import type { Tag } from "../type/typeTagBase";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: Tag | null;
  actions?: ViewSheetActions;
};

export function UiTagView({ open, onOpenChange, tag, actions }: Props) {
  return (
    <UiViewSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de la etiqueta"
      description="Información de la etiqueta."
      empty={tag ? undefined : "No se encontró la etiqueta."}
      actions={actions}
    >
      {tag && (
        <>
          <UiViewField label="Nombre">
            <p className="flex items-center gap-2 font-medium">
              {tag.color && (
                <span
                  className="size-3 shrink-0 rounded-full border"
                  style={{ backgroundColor: tag.color }}
                />
              )}
              {tag.name}
            </p>
          </UiViewField>
          <UiViewField label="Descripción">
            <p className="whitespace-pre-wrap">{tag.description ?? "—"}</p>
          </UiViewField>
          <UiViewField label="Color">
            <p>{tag.color ?? "—"}</p>
          </UiViewField>
          <UiViewField label="Tareas">
            <p>{tag.tasks_count ?? 0}</p>
          </UiViewField>
        </>
      )}
    </UiViewSheet>
  );
}
