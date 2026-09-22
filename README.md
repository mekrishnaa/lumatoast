# LumaToast

A beautiful, lightweight, framework-agnostic toast notification library — inspired by Linear, Vercel, and Apple VisionOS.

[![npm version](https://img.shields.io/npm/v/lumatoast)](https://www.npmjs.com/package/lumatoast)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ✨ **Glassmorphism UI** — VisionOS-inspired frosted glass design
- 🎨 **9 built-in themes** — linear, aurora, vision, minimal, cupertino, material, terminal, github, cyberpunk
- ⚡ **Promise API** — show loading → auto-transition to success or error
- 📱 **Mobile gestures** — swipe to dismiss, direction-aware
- 🌙 **Dark & Light mode** — themes support both
- ⌨️ **Keyboard accessible** — Escape to dismiss, full focus management
- ♿ **ARIA compliant** — live regions, roles, labels
- 📦 **Framework agnostic** — works with Vanilla JS, React, Vue, Angular, Svelte
- 🪶 **Zero dependencies** — pure TypeScript, no external runtime deps

---

## Installation

```bash
npm install lumatoast
```

---

## Quick Start

### 1. Import the CSS

```js
import "lumatoast/styles.css";
```

> Add this once at your app entry point (e.g. `main.ts`, `App.tsx`).

### 2. Initialize the renderer

```js
import { initializeRenderer, toast } from "lumatoast";

initializeRenderer();
```

### 3. Show toasts

```js
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


### React

```tsx
// main.tsx
import "lumatoast/styles.css";
import { initializeRenderer } from "lumatoast";

initializeRenderer();
```

```tsx
// In any component:
import { toast } from "lumatoast";

function SaveButton() {
    const handleClick = async () => {
        await toast.promise(saveData(), {
            loading: { description: "Saving..." },
            success: { description: "Saved!" },
            error:   { description: "Error saving." }
        });
    };

    return <button onClick={handleClick}>Save</button>;
}
```

### Vue

```ts
// main.ts
import "lumatoast/styles.css";
import { initializeRenderer } from "lumatoast";

initializeRenderer();
createApp(App).mount("#app");
```

```vue
<script setup>
import { toast } from "lumatoast";
const notify = () => toast.success("Hello from Vue!");
</script>
```

### Angular

```ts
// main.ts
import "lumatoast/styles.css";
import { initializeRenderer } from "lumatoast";

initializeRenderer();
bootstrapApplication(AppComponent, appConfig);
```

### Vanilla JS

```html
<link rel="stylesheet" href="node_modules/lumatoast/dist/styles.css" />
<script type="module">
    import { initializeRenderer, toast } from "lumatoast";
    initializeRenderer();
    document.querySelector("#btn").onclick = () => toast.success("Hello!");
</script>
```

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
