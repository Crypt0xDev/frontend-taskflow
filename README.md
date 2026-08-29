<div align="center">

# TaskFlow Frontend

Gestión de **tareas, categorías, etiquetas y comentarios** con panel de administración.

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000?logo=shadcnui)

</div>


## 🚀 Quick start

**Requisitos previos:**
- Node.js y npm instalados

**Pasos:**

1. **Configurar variables de entorno**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```
   Luego accede a `http://localhost:3000`

> Solo **frontend**. El [Backend](https://github.com/Crypt0xDev/backend-taskflow.git). Laravel (`/api/v1`) vive en otro repositorio.

## 🛠️ Tecnologías

- **Next.js 16** - Framework React con SSR/SSG
- **React 19** - Librería UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Estilos utilitarios
- **shadcn/ui** - Componentes accesibles y reutilizables
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP
- **Sonner** - Notificaciones toast

## ✨ Features

| Módulo | Funciones |
|---|---|
| 📋 **Tareas** | CRUD · prioridad · estado · categoría · etiquetas · vencimiento · papelera |
| 🗂️ **Categorías / Etiquetas** | CRUD · color · descripción · buscador + filtros · papelera |
| 📅 **Calendario** | tareas por fecha de vencimiento (vista mensual) |
| 👤 **Perfil** | nombre · correo · contraseña · fecha de nacimiento · avatar |
| 🛡️ **Admin** | usuarios · moderación de comentarios · roles y permisos (RBAC) |

**UX/UI:** tema dark premium · responsive (móvil→desktop) · skeletons · toasts · animaciones · modo claro/oscuro.

## 🔐 Auth

Login por **email + contraseña** (token Sanctum). Roles **`admin`** / **`user`**. Cuentas creadas por admin fuerzan cambio de contraseña al primer acceso.

## 🧱 Estructura

```
app/(app)/          área privada (sidebar + guard)
app/(public)/       landing, about, contact
app/modules/<x>/    ui · hooks · services · type · schema
components/         UiXxx.tsx (+ ui/ = shadcn)
hooks/ lib/ config/ utilidades globales
```

**Convención:** `UiXxx.tsx` · `useXxx.ts` · `serviceXxx.ts` · `typeXxx.ts`

**Compartidos:** `UiActionToolbar` · `UiSelectableRow`+`useRowSelection` · `UiViewSheet` · `UiTrashSheet`+`useTrash` · `UiConfirmDialog`

## 📦 Scripts

```bash
npm run dev      # desarrollo
npm run build    # producción
npm run lint     # eslint
```

## 📚 Contexto académico

Proyecto del curso **Programación Web con Laravel** (CTI) — **UNSM**, Facultad de Ingeniería de Sistemas e Informática.

## 📝 Licencia

MIT License. See [LICENSE](LICENSE) for details.
