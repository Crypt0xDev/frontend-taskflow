import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "TaskFlow es un gestor de tareas simple y rápido, pensado para que organices tu día sin fricción.",
};

const VALUES = [
  {
    title: "Simple por diseño",
    desc: "Nada de menús interminables. Anota, prioriza y avanza.",
    tone: "bg-brand-100 text-brand-600",
    icon: "M13 10V3L4 14h7v7l9-11h-7Z",
  },
  {
    title: "Privado por defecto",
    desc: "Tus tareas y categorías son tuyas: cada quien ve solo lo suyo.",
    tone: "bg-warm-100 text-warm-600",
    icon: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z",
  },
  {
    title: "Sin perder nada",
    desc: "La papelera guarda lo que eliminas por si cambias de idea.",
    tone: "bg-brand-100 text-brand-600",
    icon: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
        Acerca de TaskFlow
      </span>
      <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
        Menos fricción, más hecho.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-500">
        TaskFlow nació de una idea simple: organizarse no debería ser otra tarea más.
        Por eso lo diseñamos para que capturar, clasificar y completar tus pendientes
        sea rápido y natural, en cualquier dispositivo.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-3xl border border-ink-100 bg-surface p-6 shadow-soft">
            <div className={`inline-flex rounded-2xl p-3 ${v.tone}`}>
              <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-lg font-bold">{v.title}</h2>
            <p className="mt-2 text-sm text-ink-500">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-wrap items-center gap-3">
        <Link
          href="/register"
          className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-600"
        >
          Crear mi cuenta
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-ink-200 bg-surface px-6 py-3 font-semibold text-ink-700 transition hover:-translate-y-0.5 hover:border-ink-300"
        >
          Hablar con nosotros
        </Link>
      </div>
    </main>
  );
}
