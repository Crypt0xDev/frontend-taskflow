import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Salida self-contained para Docker: genera .next/standalone con
  // solo las dependencias necesarias para correr el server en producción.
  output: "standalone",
};

export default nextConfig;
