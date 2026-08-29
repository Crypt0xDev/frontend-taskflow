# ---------- Etapa 1: dependencias ----------
FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Etapa 2: build ----------
FROM node:22-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* se hornea en el bundle en tiempo de build: hay que pasarla aquí.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Etapa 3: runtime ----------
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Usuario sin privilegios
RUN addgroup -g 1001 -S nodejs \
    && adduser -u 1001 -S nextjs -G nodejs

# Salida standalone: server + solo lo necesario, más estáticos y public
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
