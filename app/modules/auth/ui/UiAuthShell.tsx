import Link from "next/link";

import { UiModeToggle } from "@/components/UiModeToggle";

export function UiAuthShell({ children, brand = true }: { children: React.ReactNode; brand?: boolean }) {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 p-4">
      <UiModeToggle className="absolute right-4 top-4" />
      {brand && (
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-8 -rotate-6 place-items-center rounded-xl bg-brand-500 text-white shadow-brand">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight">TaskFlow</span>
        </Link>
      )}
      {children}
    </main>
  );
}
