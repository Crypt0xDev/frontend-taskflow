import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// La API es otro origen (p. ej. https://apialexis.lubot.men): hay que permitirla en connect-src.
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL).origin;
  } catch {
    return "";
  }
})();

// CSP: todo se sirve desde este mismo origen (las fuentes de next/font se incrustan en el build).
// - script-src necesita 'unsafe-inline' por los scripts en línea de Next y del tema (next-themes).
// - En desarrollo, el hot reload de Next usa eval y websockets.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin}${isDev ? " ws: wss:" : ""}`.trim(),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Nadie puede incrustar la app en un iframe (clickjacking).
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,

  // URLs antiguas: los enlaces de verificación ya enviados por correo siguen funcionando
  // (la query ?status=… se conserva en la redirección).
  async redirects() {
    return [
      { source: "/verify-email", destination: "/email", permanent: true },
      { source: "/forgot-password", destination: "/password/reset", permanent: true },
      { source: "/password", destination: "/password/reset", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
