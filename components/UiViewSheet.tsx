"use client";

import type { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "@/components/ui/sheet";

export type ViewSheetActions = {
  onEdit?: () => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  extra?: ReactNode;
};

type ViewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  empty?: ReactNode;
  children?: ReactNode;
  actions?: ViewSheetActions;
};

export function UiViewSheet({ open, onOpenChange, title, description, empty, children, actions }: ViewSheetProps) {
  const hasActions = Boolean(children && (actions?.onEdit || actions?.onDelete || actions?.extra));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children ? (
          <div className="space-y-4 px-4 pt-4 text-sm">{children}</div>
        ) : (
          <p className="px-4 pt-4 text-sm text-muted-foreground">{empty}</p>
        )}
        {hasActions && actions && (
          <div className="mt-auto flex flex-wrap gap-2 border-t p-4">
            {actions.extra}
            {actions.onEdit && (
              <Button className="flex-1" onClick={actions.onEdit}>
                <Pencil className="size-4" />
                Editar
              </Button>
            )}
            {actions.onDelete && (
              <Button
                variant="outline"
                className="flex-1 text-destructive hover:text-destructive"
                disabled={actions.deleteDisabled}
                onClick={actions.onDelete}
              >
                <Trash2 className="size-4" />
                Eliminar
              </Button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function UiViewField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
