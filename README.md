# Vike + Fastify Starter Kit

> A modern fullstack starter powered by **Fastify**, **Vike**, **Vue 3**, **UnoCSS**, and **Pinia** — written in **TypeScript**, with built-in **SEO** support via Unhead.js.

Build fast, reactive web applications with SSR, API routes, and utility-first styling — all in one unified stack.

---

## 🚀 What's Inside

This starter kit includes everything you need for a high-performance fullstack app:

| Feature                  | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| ⚡ **Fastify**            | Blazing-fast, low-overhead Node.js backend                               |
| 🧠 **Vike**              | Meta-framework offering fine-grained SSR, routing, and rendering control |
| 🖼 **Vue 3**             | Modern frontend with Composition API and full TypeScript support         |
| 🎨 **UnoCSS**            | Atomic-first CSS engine with instant build time                          |
| 📦 **Pinia**             | Reactive, type-safe state management                                     |
| 🔠 **TypeScript**        | End-to-end type safety across backend and frontend                       |
| 🧪 **Test-Ready**        | Easy to integrate with Vitest, Supertest, etc.                           |
| 🔍 **SEO-Ready**         | Built-in SEO support via [Unhead.js](https://unhead.unjs.io/)            |
| 📁 **Modular Structure** | Clear separation of concerns for maintainability                         |

---

## 🧠 SEO with Unhead.js

You can define page-level head tags using **Unhead.js**:

### Option 1: `+unhead.ts`

Add a `+unhead.ts` file in your page directory:

```ts
// +unhead.ts
import type { HeadConfig } from '@unhead/schema'

export default {
  title: 'Home Page',
  meta: [
    { name: 'description', content: 'Welcome to the Vike + Fastify Starter Kit' }
  ]
} satisfies HeadConfig
```

### Option 2: Inline in `+data.ts`

Return a `unhead` property in your data loader:

```ts
// +data.ts
export default async function() {
  return {
    pageData: { /* ... */ },
    unhead: {
      title: 'About Page',
      meta: [{ name: 'description', content: 'Learn more about this starter kit' }]
    }
  }
}
```

---

## 📁 Project Structure

```bash
.
├── client/           # Vue + Vike frontend
│   ├── pages/        # File-based routing (+Page.vue, +data.ts, +unhead.ts)
│   └── components/   # Shared Vue components
├── server/           # Fastify backend (API routes, plugins, etc.)
├── shared/           # Shared types, stores, and composables
├── unocss.config.ts  # UnoCSS setup
├── vite.config.ts    # Vite + Vike configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Scripts and dependencies
```

---

## ⚙️ Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/yourhandle/vike-fastify-starter-kit
cd vike-fastify-starter-kit

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev
```

### Available Scripts

| Command        | Description                            |
| -------------- | -------------------------------------- |
| `pnpm dev`     | Start dev servers (backend + frontend) |
| `pnpm build`   | Build production frontend and backend  |
| `pnpm preview` | Preview the production build           |

---

## 🧪 Demo Pages

Explore real examples built with this stack:

* 🔄 **Pinia Counter** – Demonstrates reactive state management
* 🎨 **UnoCSS Playground** – Showcases utility-first styling
* 🧠 **SSR Page** – Page rendered on the server with hydration
* ⚙️ **API Route Example** – Fastify route returning JSON
* 🗂 **SPA Page** – Purely client-side rendered page

---

## 📦 Deployment

Easily deploy to platforms like:

* **Vercel**
* **Netlify**
* **Render**
* **Fly.io**
* **Docker**

Just make sure your build step is complete and point to the appropriate `dist/` output.

---

## 📜 License

[MIT](./LICENSE)

---

## ❤️ Credits

Made with ❤️ using:

* [Fastify](https://fastify.io)
* [Vike](https://vike.dev)
* [Vue 3](https://vuejs.org)
* [UnoCSS](https://unocss.dev)
* [Pinia](https://pinia.vuejs.org)
* [Unhead.js](https://unhead.unjs.io)