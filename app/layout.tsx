import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";

import { UiThemeProvider } from "@/components/UiThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/lib/session";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TaskFlow — organiza tus tareas",
    template: "%s · TaskFlow",
  },
  description:
    "TaskFlow es un gestor de tareas simple y rápido: organiza, clasifica por categorías y no pierdas nada con la papelera.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${jakarta.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink-50 text-ink-900">
        <UiThemeProvider>
          <SessionProvider>{children}</SessionProvider>
          <Toaster position="bottom-right" mobileOffset={{ bottom: 72 }} />
        </UiThemeProvider>
      </body>
    </html>
  );
}
