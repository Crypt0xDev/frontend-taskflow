export function UiLoadingText({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center py-8 text-sm text-ink-500">
      {label}
    </div>
  );
}

export function UiLoadingSpinner() {
  return (
    <div className="flex w-full items-center justify-center py-10">
      <div className="size-10 animate-spin rounded-full border-4 border-brand-500/20 border-t-brand-500" />
    </div>
  );
}
