"use client";

import { useState } from "react";

import { UiActionToolbar } from "@/components/UiActionToolbar";
import { useRowSelection } from "@/hooks/useRowSelection";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { UiLoadError } from "@/components/UiLoadError";
import { UiSelectableRow } from "@/components/UiSelectableRow";
import { UiViewField, UiViewSheet } from "@/components/UiViewSheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { useSession } from "@/lib/session";

import { useCommentModeration } from "./hooks/useCommentModeration";
import type { Comment } from "./type/typeCommentBase";

export default function UiCommentModerationPage() {
  const { comments, total, loading, error, reload, query, setQuery, remove } = useCommentModeration();
  const { hasPermission } = useSession();
  const canDelete = hasPermission("comments", "delete");
  const [deleting, setDeleting] = useState<Comment | null>(null);
  const [viewing, setViewing] = useState<Comment | null>(null);
  const { selected, hasSelection, toggle, clear, isSelected } = useRowSelection(comments);

  return (
    <div className="space-y-4">
      <UiHeaderModule
        title="Comentarios"
        description={`Modera el contenido publicado · ${total} en total.`}
      />

      <UiActionToolbar
        hasSelection={hasSelection}
        onView={() => selected && setViewing(selected)}
        onDelete={canDelete ? () => selected && setDeleting(selected) : undefined}
        hideSelectionActionsOnMobile
      />

      <Input
        placeholder="Buscar por autor o contenido…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:max-w-xs"
      />

      {loading ? (
        <div className="space-y-2 rounded-md border p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : error && total === 0 ? (
        <UiLoadError message="No se pudieron cargar los comentarios." onRetry={reload} />
      ) : comments.length === 0 ? (
        <div className="animate-fade-up rounded-md border p-10 text-center">
          <p className="font-medium">No hay comentarios</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {query ? "Ningún comentario coincide con la búsqueda." : "Aún no se ha publicado nada."}
          </p>
        </div>
      ) : (
        <div className="animate-fade-up space-y-2 sm:space-y-0">
          <div className="space-y-2 sm:hidden">
            {comments.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setViewing(c)}
                className="block w-full rounded-md border p-3 text-left transition-colors active:bg-muted"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="bg-muted text-xs font-bold">
                      {(c.author?.username ?? "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {c.author?.username ?? "Anónimo"}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(c.created_at)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.body}</p>
              </button>
            ))}
          </div>

          <div className="hidden rounded-md border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Autor</TableHead>
                  <TableHead>Comentario</TableHead>
                  <TableHead className="w-40">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((c) => (
                    <UiSelectableRow key={c.id} selected={isSelected(c)} onSelect={() => toggle(c)}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-muted text-xs font-bold">
                              {(c.author?.username ?? "?").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{c.author?.username ?? "Anónimo"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <span className="line-clamp-2">{c.body}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(c.created_at)}
                      </TableCell>
                    </UiSelectableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <UiViewSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title="Detalle del comentario"
        description="Contenido completo publicado."
        empty={viewing ? undefined : "No se encontró el comentario."}
        actions={
          viewing && canDelete
            ? {
                onDelete: () => {
                  setViewing(null);
                  setDeleting(viewing);
                },
              }
            : undefined
        }
      >
        {viewing && (
          <>
            <UiViewField label="Autor">
              <p className="font-medium">{viewing.author?.username ?? "Anónimo"}</p>
            </UiViewField>
            <UiViewField label="Fecha">
              <p>{formatDateTime(viewing.created_at)}</p>
            </UiViewField>
            <UiViewField label="Comentario">
              <p className="whitespace-pre-wrap">{viewing.body}</p>
            </UiViewField>
          </>
        )}
      </UiViewSheet>

      <UiConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar comentario?"
        description={
          deleting ? `Se eliminará el comentario de «${deleting.author?.username ?? "Anónimo"}».` : undefined
        }
        confirmText="Eliminar"
        destructive
        onConfirm={async () => {
          if (deleting) {
            await remove(deleting.id);
            clear();
          }
        }}
      />
    </div>
  );
}
