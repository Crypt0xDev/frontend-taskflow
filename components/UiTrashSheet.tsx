"use client";

import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";

import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type TrashActions<T> = {
  items: T[];
  loading: boolean;
  restoreOne: (id: number) => Promise<boolean>;
  forceOne: (id: number) => Promise<boolean>;
  restoreAll: () => Promise<boolean>;
  forceAll: () => Promise<boolean>;
};

type Props<T extends { id: number }> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
  title?: string;
  description?: string;
  emptyLabel?: string;
  itemLabel?: { one: string; many: string };
  renderItem: (item: T) => React.ReactNode;
  trash: TrashActions<T>;
};

export function UiTrashSheet<T extends { id: number }>({
  open,
  onOpenChange,
  onChanged,
  title = "Papelera",
  description = "Restaura un elemento o elimínalo definitivamente.",
  emptyLabel = "La papelera está vacía.",
  itemLabel = { one: "elemento", many: "elementos" },
  renderItem,
  trash,
}: Props<T>) {
  const { items, loading, restoreOne, forceOne, restoreAll, forceAll } = trash;
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (await restoreAll()) onChanged();
              }}
            >
              <RotateCcw className="size-4" />
              Restaurar todo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setConfirmEmpty(true)}
            >
              <Trash2 className="size-4" />
              Vaciar papelera
            </Button>
          </div>
        )}

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ul className="divide-y overflow-y-auto px-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2 py-3">
                <div className="min-w-0">{renderItem(item)}</div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      if (await restoreOne(item.id)) onChanged();
                    }}
                  >
                    Restaurar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => forceOne(item.id)}
                  >
                    Borrar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>

      <UiConfirmDialog
        open={confirmEmpty}
        onOpenChange={setConfirmEmpty}
        title="¿Vaciar la papelera?"
        description={`Se eliminarán definitivamente ${items.length} ${items.length === 1 ? itemLabel.one : itemLabel.many
          }. Esta acción no se puede deshacer.`}
        confirmText="Vaciar papelera"
        destructive
        onConfirm={forceAll}
      />
    </Sheet>
  );
}
