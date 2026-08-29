import type { Metadata } from "next";

import { UiContactForm } from "@/components/UiContactForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contacto",
  description: "¿Tienes dudas o sugerencias sobre TaskFlow? Escríbenos.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto grid max-w-5xl items-start gap-10 px-6 py-16 sm:py-24 lg:grid-cols-2">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
          Contacto
        </span>
        <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Hablemos.
        </h1>
        <p className="mt-6 max-w-md text-lg text-ink-500">
          ¿Tienes una duda, una idea o encontraste algo que mejorar? Escríbenos y te
          respondemos lo antes posible.
        </p>

        <ul className="mt-8 space-y-3 text-sm text-ink-600">
          <li className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-100 text-brand-600">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </span>
            hola@taskflow.test
          </li>
        </ul>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Envíanos un mensaje</CardTitle>
          <CardDescription>Completa el formulario y te contactamos.</CardDescription>
        </CardHeader>
        <CardContent>
          <UiContactForm />
        </CardContent>
      </Card>
    </main>
  );
}
