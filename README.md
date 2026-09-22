# 🍞 LumaToast

A beautiful, lightweight, framework-agnostic toast notification library — inspired by Linear, Vercel, and Apple VisionOS.

[![Live Playground](https://img.shields.io/badge/⚡_Live_Demo-Interactive_Playground-7c3aed?style=for-the-badge&logo=vercel)](https://lumatoast.vercel.app)
[![npm version](https://img.shields.io/npm/v/lumatoast?style=for-the-badge&color=2563eb)](https://www.npmjs.com/package/lumatoast)
[![Node.js Version](https://img.shields.io/node/v/lumatoast?style=for-the-badge&color=16a34a)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-f59e0b.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> 🎮 **[Try the Interactive Live Playground →](https://lumatoast.vercel.app)**  
> Test all 9 themes, mobile swipe gestures, animation styles, progress bar positions, and customization options live in your browser!

---

- ✨ **Glassmorphism UI** — VisionOS-inspired frosted glass design
- 🎨 **9 built-in themes** — linear, aurora, vision, minimal, cupertino, material, terminal, github, cyberpunk
- ⚡ **Promise API** — show loading → auto-transition to success or error
- 📱 **Mobile gestures** — swipe to dismiss, direction-aware
- 🌙 **Dark & Light mode** — themes support both
- ⌨️ **Keyboard accessible** — Escape to dismiss, full focus management
- ♿ **ARIA compliant** — live regions, roles, labels
- 📦 **Framework agnostic** — works with React, Vue, Angular, Svelte, Solid, Vanilla JS
- 🪶 **Zero dependencies** — pure TypeScript, no external runtime deps
- 🟢 **Node.js Support** — requires Node `>= 18.0.0` (LTS 18, 20, 22+)

---

## Installation

```bash
npm install lumatoast
```

---

## How It Works: Setup in 3 Simple Steps

LumaToast is designed around a clean separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│ 1. App Entry Point (run ONCE at startup)                │
│    import "lumatoast/styles.css";                       │
│    import { initializeRenderer } from "lumatoast";      │
│    initializeRenderer();                                │
└───────────────────────────┬─────────────────────────────┘
                            │ (sets up singleton container)
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Any Component / Service / Action (ANYWHERE in app)   │
│    import { toast } from "lumatoast";                   │
│    toast.success("Profile saved!");                     │
└─────────────────────────────────────────────────────────┘
```

### Step 1: Import the CSS (Once at App Root)
Add this in your root entry file (e.g. `main.tsx`, `main.ts`, `app/layout.tsx`, or global stylesheet):

```ts
import "lumatoast/styles.css";
```

### Step 2: Initialize the Renderer (Once at App Bootstrap)
Call `initializeRenderer()` once when your application mounts. It sets up the toast container in the DOM and listens for events:

```ts
import { initializeRenderer } from "lumatoast";

initializeRenderer();
```

### Step 3: Trigger Toasts from Anywhere
Import `toast` in any component, button handler, API callback, or utility file:

```ts
import { toast } from "lumatoast";

toast.success("Profile updated!");
toast.error("Something went wrong.");
toast.warning("Disk space is low.");
toast.info("New version available.");
```

---

## API Reference

### `toast.success(message, options?)`
### `toast.error(message, options?)`
### `toast.warning(message, options?)`
### `toast.info(message, options?)`
### `toast.loading(message, options?)`
### `toast.custom(message, options?)`

Show a toast. All methods return the `ToastItem` (with its `id`).

```ts
toast.success("Saved!", {
    title: "Success",
    duration: 5000,
    position: "bottom-right",
    theme: "minimal",
    dismissible: true,
    action: {
        label: "Undo",
        onClick: () => console.log("Undo!")
    }
});
```

> `toast.loading()` sets `duration: Infinity` and `dismissible: false` automatically.

---

### `toast.promise(promise, options)`

Track a promise — shows a loading toast, then auto-transitions to success or error.

```ts
toast.promise(fetch("/api/save"), {
    loading: { description: "Saving your work..." },
    success: { title: "Saved!", description: "Changes saved successfully." },
    error:   { title: "Error", description: "Failed to save changes." }
});
```

---

### `toast.update(id, updates)`

Update an existing toast in-place. Useful for manual loading → success transitions.

```ts
const loading = toast.loading("Uploading...");

setTimeout(() => {
    toast.update(loading.id, {
        type: "success",
        description: "Upload complete!",
        duration: 3000,
        dismissible: true
    });
}, 2000);
```

---

### `toast.dismiss(id)`
### `toast.dismissAll()`
### `toast.dismissLatest()`

Programmatically remove toasts. Pressing `Escape` also calls `dismissLatest()`.

---

### `toast.subscribe(listener)`

React to toast state changes. Returns an unsubscribe function.

```ts
const unsub = toast.subscribe((toasts) => {
    console.log("Active toasts:", toasts);
});

// Stop listening:
unsub();
```

---

### `toast.configure(config)`

Set global defaults so you don't have to repeat options on every call.

```ts
toast.configure({
    position: "bottom-right",
    theme: "minimal",
    duration: 3000,
    dismissible: true,
    maxVisible: 3
});
```

Per-toast options always override global defaults.

---

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | auto-generated | Stable id for the toast |
| `title` | `string` | — | Bold title text |
| `description` | `string` | — | Body text |
| `duration` | `number` | `4000` | Auto-dismiss delay in ms. `Infinity` = never |
| `dismissible` | `boolean` | `true` | Show the × close button |
| `position` | `ToastPosition` | `"top-right"` | Where the toast appears |
| `theme` | `ToastTheme` | `"linear"` | Visual theme |
| `action` | `ToastAction` | — | Action button with label and onClick |

### Positions

`top-left` · `top-center` · `top-right` · `bottom-left` · `bottom-center` · `bottom-right`

### Themes

`linear` · `aurora` · `vision` · `minimal` · `cupertino` · `material` · `terminal` · `github` · `cyberpunk`

---

## Customization

LumaToast uses a two-layer system:

| Layer | What it controls | How |
|---|---|---|
| **CSS custom properties** | Colors, typography, sizes, shadows | Override `--luma-*` variables in your CSS |
| **JS options** | Layout and structural changes | Options in `configure()` or per-toast |

---

### CSS Custom Properties

Override any variable globally on `:root`, or per-theme:

```css
/* Global overrides */
:root {
    --luma-font:         "Inter", sans-serif;
    --luma-radius:       24px;
    --luma-width:        380px;
    --luma-title-size:   16px;
    --luma-title-weight: 700;
}

/* Override only in the linear theme */
.luma-theme-linear {
    --luma-bg:           rgba(0, 0, 0, 0.85);
    --luma-border-color: rgba(255, 255, 255, .15);
}
```

#### Full Variable Reference

**Card Layout**

| Variable | Default | Description |
|---|---|---|
| `--luma-width` | `340px` | Card width |
| `--luma-radius` | `18px` | Border radius |
| `--luma-padding` | `14px 16px 18px` | Card padding |
| `--luma-gap` | `12px` | Gap between icon, content, close button |

**Background & Border**

| Variable | Default | Description |
|---|---|---|
| `--luma-bg` | theme-defined | Card background (supports gradients) |
| `--luma-border-color` | theme-defined | Border color |
| `--luma-border-width` | `1px` | Border width |
| `--luma-shadow` | theme-defined | Box shadow |
| `--luma-backdrop` | theme-defined | `backdrop-filter` value |

**Typography**

| Variable | Default | Description |
|---|---|---|
| `--luma-font` | `inherit` | Font family |
| `--luma-title-size` | `15px` | Title font size |
| `--luma-title-weight` | `600` | Title font weight |
| `--luma-title-color` | `#ffffff` | Title color |
| `--luma-desc-size` | `14px` | Description font size |
| `--luma-desc-color` | `rgba(255,255,255,.72)` | Description color |
| `--luma-line-height` | `1.5` | Line height |
| `--luma-letter-spacing` | `normal` | Letter spacing |

**Progress Bar**

| Variable | Default | Description |
|---|---|---|
| `--luma-progress-height` | `3px` | Bar thickness |
| `--luma-progress-radius` | `0px` | Bar border radius |
| `--luma-progress-success` | green gradient | Color for success toasts |
| `--luma-progress-error` | red gradient | Color for error toasts |
| `--luma-progress-warning` | amber gradient | Color for warning toasts |
| `--luma-progress-info` | blue gradient | Color for info toasts |
| `--luma-progress-loading` | gray gradient | Color for loading toasts |
| `--luma-progress-custom` | purple gradient | Color for custom toasts |

**Action Button**

| Variable | Default | Description |
|---|---|---|
| `--luma-action-bg` | `rgba(255,255,255,.08)` | Button background (solid variant) |
| `--luma-action-color` | `#ffffff` | Button text color |
| `--luma-action-hover-bg` | `rgba(255,255,255,.16)` | Hover background |
| `--luma-action-radius` | `10px` | Button border radius |
| `--luma-action-padding` | `8px 12px` | Button padding |
| `--luma-action-size` | `14px` | Font size |
| `--luma-action-weight` | `500` | Font weight |
| `--luma-action-border` | `none` | Border (outline/ghost variants) |

**Animation Durations** (set automatically by `animationSpeed`)

| Variable | Default | Description |
|---|---|---|
| `--luma-duration-enter` | `320ms` | Enter animation duration |
| `--luma-duration-exit` | `300ms` | Exit animation duration |
| `--luma-duration-stack` | `280ms` | Stack reorder duration |

---

### Animation Options

```ts
toast.configure({
    animationEnter: "slide",   // "slide" | "fade" | "scale" | "bounce" | "none"
    animationExit:  "slide",   // "slide" | "fade" | "none"
    animationSpeed: "normal",  // "slow"  | "normal" | "fast"  (global speed preset)
});

// Or per-toast:
toast.success("Bouncy!", { animationEnter: "bounce", animationExit: "fade" });
```

| `animationEnter` | Effect |
|---|---|
| `slide` (default) | Slides down + fades in |
| `fade` | Fades in only |
| `scale` | Scales up from center |
| `bounce` | Spring overshoot |
| `none` | Instant appearance |

| `animationExit` | Effect |
|---|---|
| `slide` (default) | Slides right + fades out |
| `fade` | Fades out + collapses |
| `none` | Instant removal |

---

### Action Button Variants

```ts
toast.success("Archived.", {
    action: {
        label: "Undo",
        onClick: () => {},
        variant: "outline",  // "solid" | "outline" | "ghost"
    }
});
```

| Variant | Appearance |
|---|---|
| `solid` (default) | Filled background |
| `outline` | Transparent + border |
| `ghost` | Text only, no background or border |

---

### Progress Bar Placement

```ts
// Move progress bar to top of the card
toast.success("Saving...", { progressPosition: "top", duration: 5000 });

// Or globally:
toast.configure({ progressPosition: "top" });
```

---

### Show/Hide Icon

```ts
toast.info("No icon here", { showIcon: false });

// Globally:
toast.configure({ showIcon: false });
```

---

### Click-to-Dismiss

```ts
// Dismiss when the user clicks anywhere on the card body
toast.success("Click me to dismiss", { closeOnClick: true });

// Globally:
toast.configure({ closeOnClick: true });
```

---

### Inline Style Overrides

Apply inline styles directly to the card — supports both regular CSS properties and CSS custom properties:

```ts
toast.success("Custom!", {
    style: {
        "--luma-bg":     "linear-gradient(135deg, #1a1a2e, #16213e)",
        "--luma-radius": "24px",
        "--luma-shadow": "0 0 30px rgba(138,43,226,.4)",
    }
});
```

---

### Extra CSS Classes

Add your own CSS class to the toast wrapper for full control:

```ts
toast.success("Custom class", { className: "my-brand-toast" });
```

```css
.my-brand-toast .luma-toast-card {
    background: var(--brand-surface);
    border: 2px solid var(--brand-primary);
}
```

---

### Building a Custom Theme

Create a CSS file that sets `--luma-*` variables on your theme class:

```css
/* my-theme.css */
.luma-theme-brand {
    --luma-bg:           #1a1a2e;
    --luma-border-color: #e040fb;
    --luma-border-width: 2px;
    --luma-radius:       20px;
    --luma-shadow:       0 0 24px rgba(224, 64, 251, .3);
    --luma-title-color:  #CE93D8;
    --luma-desc-color:   #9C27B0;
    --luma-font:         "Poppins", sans-serif;
    --luma-progress-success: linear-gradient(90deg, #e040fb, #7c4dff);
    --luma-action-bg:    rgba(224, 64, 251, .12);
    --luma-action-color: #e040fb;
}
```

Then use it:

```ts
// Extend the type if using TypeScript:
// declare module "lumatoast" {
//   interface ToastTheme extends Record<"brand", unknown> {}
// }

toast.success("Custom theme!", { theme: "brand" as any });
```

---

## Framework Guides

LumaToast is completely framework-agnostic. The pattern is always the same:
1. **Import `lumatoast/styles.css`** once at the root.
2. **Call `initializeRenderer()`** once when the app loads.
3. **Use `toast.*()`** anywhere!

---

### React (Vite / CRA)

In your application entry point (`src/main.tsx` or `src/index.tsx`):

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 1. Import styles and initialize once
import "lumatoast/styles.css";
import { initializeRenderer } from "lumatoast";

initializeRenderer();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Then trigger toasts anywhere in your components:

```tsx
// src/components/SaveButton.tsx
import { toast } from "lumatoast";

export function SaveButton() {
  const handleSave = async () => {
    await toast.promise(saveUserData(), {
      loading: { title: "Saving", description: "Saving profile changes..." },
      success: { title: "Saved!", description: "Profile updated successfully." },
      error:   { title: "Error",  description: "Failed to save profile." },
    });
  };

  return <button onClick={handleSave}>Save Changes</button>;
}
```

---

### Next.js (App Router)

Since Next.js App Router renders on the server, create a simple client-side component to initialize the renderer:

```tsx
// app/components/Toaster.tsx
"use client";

import { useEffect } from "react";
import { initializeRenderer } from "lumatoast";
import "lumatoast/styles.css";

export function Toaster() {
  useEffect(() => {
    initializeRenderer();
  }, []);

  return null;
}
```

Mount `<Toaster />` once in your root layout:

```tsx
// app/layout.tsx
import { Toaster } from "./components/Toaster";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
```

Now call `toast.success()`, `toast.error()`, etc. in any client component:

```tsx
"use client";
import { toast } from "lumatoast";

export default function Page() {
  return <button onClick={() => toast.success("Welcome to Next.js!")}>Notify</button>;
}
```

---

### Next.js (Pages Router)

In `pages/_app.tsx`:

```tsx
// pages/_app.tsx
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { initializeRenderer } from "lumatoast";
import "lumatoast/styles.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initializeRenderer();
  }, []);

  return <Component {...pageProps} />;
}
```

---

### Vue 3 / Vite

In `src/main.ts`:

```ts
// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";

// 1. Import styles and initialize
import "lumatoast/styles.css";
import { initializeRenderer } from "lumatoast";

initializeRenderer();

createApp(App).mount("#app");
```

In any Vue component (`.vue`):

```vue
<script setup lang="ts">
import { toast } from "lumatoast";

function showToast() {
  toast.success("Profile saved successfully!", {
    title: "Success",
    theme: "aurora",
  });
}
</script>

<template>
  <button @click="showToast">Save</button>
</template>
```

---

### Nuxt 3

Create a client-side plugin `plugins/lumatoast.client.ts`:

```ts
// plugins/lumatoast.client.ts
import "lumatoast/styles.css";
import { initializeRenderer } from "lumatoast";

export default defineNuxtPlugin(() => {
  initializeRenderer();
});
```

---

### Angular

#### 1. Add Styles
In `angular.json` under `styles`:
```json
"styles": [
  "node_modules/lumatoast/dist/styles.css",
  "src/styles.css"
]
```
*(Or add `@import "lumatoast/styles.css";` directly in `src/styles.css`)*.

#### 2. Initialize in `main.ts`
```ts
// src/main.ts
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { initializeRenderer } from "lumatoast";

initializeRenderer();

bootstrapApplication(AppComponent).catch((err) => console.error(err));
```

#### 3. Use in Any Angular Component or Service
```ts
import { Component } from "@angular/core";
import { toast } from "lumatoast";

@Component({
  selector: "app-root",
  standalone: true,
  template: `<button (click)="notify()">Show Toast</button>`,
})
export class AppComponent {
  notify() {
    toast.success("Hello from Angular!", { theme: "cupertino" });
  }
}
```

---

### Svelte / SvelteKit

In `src/routes/+layout.svelte` (or `src/main.ts`):

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from "svelte";
  import "lumatoast/styles.css";
  import { initializeRenderer } from "lumatoast";

  onMount(() => {
    initializeRenderer();
  });
</script>

<slot />
```

In any Svelte component:

```svelte
<script>
  import { toast } from "lumatoast";
</script>

<button on:click={() => toast.success("Hello from Svelte!")}>Notify</button>
```

---

### Vanilla JS / Static HTML

With a bundler (Vite / Webpack / Rollup):
```html
<script type="module">
  import "lumatoast/styles.css";
  import { initializeRenderer, toast } from "lumatoast";

  initializeRenderer();
  document.querySelector("#btn").onclick = () => toast.success("Ready!");
</script>
```

Direct script inclusion from node_modules:
```html
<link rel="stylesheet" href="node_modules/lumatoast/dist/styles.css" />
<script type="module">
  import { initializeRenderer, toast } from "./node_modules/lumatoast/dist/index.js";
  initializeRenderer();
  toast.success("Vanilla JS works!");
</script>
```

---

## Environment & Compatibility

| Environment | Supported Versions | Notes |
|---|---|---|
| **Node.js** | `>= 18.0.0` (18, 20, 22, 24+) | Built for modern ESM & CommonJS tooling |
| **Browsers** | Chrome, Edge, Firefox, Safari, iOS Safari | Supports modern CSS variables and flexbox |
| **Module Systems** | ESM (`import`) & CommonJS (`require`) | Dual-packaged with TypeScript declarations |
| **SSR Frameworks** | Next.js, Nuxt, Remix, SvelteKit, Astro | Crash-safe on server; initialize in client lifecycle |

---

## Keyboard Support

| Key | Action |
|---|---|
| `Escape` | Dismiss the most recent toast |
| `Tab` | Focus the action / close button |
| `Enter` / `Space` | Activate focused button |

---

## License

MIT © [Krishna Kumar](https://github.com/mekrishnaa)
