import Link from "next/link";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <AuroraBackground className="overflow-hidden" showRadialGradient>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2">
          <div>
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
              <span className="size-2 animate-pulse rounded-full bg-brand-500" />
              Tu día, bajo control
            </span>

            <h1
              className="animate-fade-up mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl"
              style={{ animationDelay: ".08s" }}
            >
              Haz que las cosas{" "}
              <span className="relative whitespace-nowrap text-brand-600">
                pasen
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-warm-400"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path d="M2 9c40-6 120-6 196-2" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <TextGenerateEffect
              words="Captura tus tareas, ordena tus prioridades y avanza sin fricción. Simple, rápido y con la energía justa para no frenarte."
              duration={0.4}
              className="mt-6 max-w-md text-lg font-normal text-ink-500"
            />

            <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: ".24s" }}>
              <Link
                href="/register"
                className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-600"
              >
                Empezar gratis
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-ink-200 bg-surface px-6 py-3 font-semibold text-ink-700 transition hover:-translate-y-0.5 hover:border-ink-300"
              >
                Saber más
              </Link>
            </div>

            <p className="animate-fade-up mt-5 text-sm text-ink-400" style={{ animationDelay: ".32s" }}>
              Sin tarjeta. Listo en un minuto.
            </p>
          </div>

          {/* Floating mock card */}
          <div className="animate-fade-up relative" style={{ animationDelay: ".2s" }}>
            <div className="animate-float">
              <div className="rotate-[1.5deg] rounded-4xl border border-ink-100 bg-surface p-5 shadow-soft">
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="font-display font-bold text-ink-900">Hoy</p>
                  <span className="text-xs font-semibold text-ink-400">3 de 5</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-2xl border-l-4 border-warm-500 bg-ink-50 p-3">
                    <span className="size-5 shrink-0 rounded-full border-2 border-warm-500" />
                    <span className="text-sm font-medium">Enviar propuesta al cliente</span>
                    <span className="ml-auto rounded-full bg-warm-100 px-2 py-0.5 text-[11px] font-bold text-warm-600">
                      Alta
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border-l-4 border-brand-400 bg-ink-50 p-3">
                    <span className="size-5 shrink-0 rounded-full border-2 border-brand-400" />
                    <span className="text-sm font-medium">Preparar reunión de equipo</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border-l-4 border-transparent p-3">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                      <svg className="size-3" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-sm text-ink-400 line-through">Responder correos</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 rotate-[-4deg] rounded-2xl border border-ink-100 bg-surface px-3 py-2 shadow-soft">
              <span className="text-sm font-bold text-brand-600">+2 completadas hoy</span>
            </div>
          </div>
        </div>
      </AuroraBackground>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-ink-100 bg-surface p-6 shadow-soft transition hover:-translate-y-1"
            >
              <div className={`inline-flex rounded-2xl p-3 ${f.tone}`}>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-16 overflow-hidden rounded-4xl bg-night px-6 py-16 text-center">
          <div className="absolute -top-16 -right-10 size-72 rounded-full bg-brand-500/30 blur-3xl" />
          <h2 className="relative font-display text-3xl font-bold text-balance text-white sm:text-4xl">
            Empieza a avanzar hoy
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/70">
            Crear una cuenta es gratis y lleva un minuto.
          </p>
          <Link
            href="/register"
            className="relative mt-8 inline-block rounded-full bg-brand-500 px-8 py-3 font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-400"
          >
            Crear mi cuenta
          </Link>
        </div>
      </section>
    </main>
  );
}

const FEATURES = [
  {
    title: "Todo en un lugar",
    desc: "Reúne tus tareas y deja de olvidar lo importante.",
    tone: "bg-brand-100 text-brand-600",
    icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    title: "Prioriza mejor",
    desc: "Distingue lo urgente de lo que puede esperar.",
    tone: "bg-warm-100 text-warm-600",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    title: "Rápido y simple",
    desc: "Sin complicaciones: anota y sigue con lo tuyo.",
    tone: "bg-brand-100 text-brand-600",
    icon: "M13 10V3L4 14h7v7l9-11h-7Z",
  },
];
