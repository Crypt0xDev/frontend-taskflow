<div align="center">

# TaskFlow Frontend

Gestión de **tareas, categorías, etiquetas y comentarios** con panel de administración.

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000?logo=shadcnui)

</div>

Solo frontend. El [backend](https://github.com/Crypt0xDev/backend-taskflow.git) (Laravel 10) vive en otro repositorio y corre aparte.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Requiere Node ≥ 20.9 (usa 22, ver `.nvmrc`). El backend debe estar corriendo en `http://localhost:8000` (o el que pongas en `.env.local`).

## Stack

| Pieza       | Tecnología                         |
| ----------- | ---------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack) |
| UI          | React 19 + TypeScript 5            |
| Componentes | shadcn/ui sobre Radix y base-ui    |
| Estilos     | Tailwind CSS 4                     |
| Formularios | React Hook Form + Zod              |

## Módulos

- **Tareas** — CRUD, prioridad, estado, categoría, etiquetas, vencimiento, papelera.
- **Categorías / Etiquetas** — CRUD, color, descripción, buscador, filtros, papelera.
- **Calendario** — tareas por fecha de vencimiento, vista mensual.
- **Comentarios** — muro público + moderación desde el panel admin.
- **Perfil** — nombre, correo, contraseña, fecha de nacimiento, avatar.
- **Admin** — usuarios, moderación de comentarios, roles y permisos (RBAC).

Tema claro/oscuro, responsive, skeletons, animaciones sutiles.

## Arquitectura

```
app/
├── (app)/…/page.tsx     rutas privadas — sidebar + guard de sesión
├── (public)/…/page.tsx  landing, about, contact, muro de comentarios
├── login/, register/    auth a nivel de ruta, no vive dentro de modules/
└── modules/<entidad>/
    ├── Ui<Entidad>Page.tsx   tabla + toolbar + filtros + sheets
    ├── schema.ts             validación zod, cuando aplica
    ├── hooks/                use<Entidad><Acción>.ts (+ index.ts)
    ├── services/             service<Entidad><Acción>.ts, llama a lib/api.ts (+ index.ts)
    ├── type/                 type<Entidad><Variante>.ts (+ index.ts)
    └── ui/                   Ui<Entidad><Acción>Form.tsx, View.tsx, etc.

components/   componentes propios (UiXxx.tsx) + ui/ con las primitivas de shadcn
hooks/        useTrash, useRowSelection, useMobile — compartidos entre módulos
lib/          api.ts, session.tsx, form.ts, utils.ts
config/       constants.ts (API_URL, timeouts, claves de storage)
```

## Scripts

| Comando         | Descripción                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Servidor de desarrollo       |
| `npm run build` | Build de producción          |
| `npm run start` | Sirve el build de producción |
| `npm run lint`  | ESLint                       |

## Docker

```bash
docker compose --env-file .env.docker up --build
```

## Contexto académico

Proyecto del curso Programación Web con Laravel (CTI) — UNSM, Facultad de Ingeniería de Sistemas e Informática.

## Licencia

MIT — ver [LICENSE](LICENSE).
