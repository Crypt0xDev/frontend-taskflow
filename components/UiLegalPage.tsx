import type { ReactNode } from "react";

import { LEGAL } from "@/config/constants";

export type LegalSection = { title: string; body: ReactNode };

export function UiLegalPage({
  badge,
  title,
  intro,
  sections,
}: {
  badge: string;
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
        {badge}
      </span>
      <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-ink-500">Última actualización: {LEGAL.lastUpdated}</p>
      <div className="mt-6 text-lg text-ink-600">{intro}</div>

      <div className="mt-12 space-y-10">
        {sections.map((section, i) => (
          <section key={section.title} aria-labelledby={`sec-${i}`}>
            <h2 id={`sec-${i}`} className="font-display text-xl font-bold">
              {i + 1}. {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-ink-600 [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-1.5 [&_a]:font-medium [&_a]:text-brand-700 [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-brand-400 [&_strong]:text-ink-800">
              {section.body}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
