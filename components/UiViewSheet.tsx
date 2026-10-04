"use client";

import type { ReactNode } from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "@/components/ui/sheet";

type ViewSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  empty?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
};

export function UiViewSheet({ open, onOpenChange, title, description, empty, children, footer }: ViewSheetProps) {
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
        {footer && <div className="mt-auto flex gap-2 border-t p-4">{footer}</div>}
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
