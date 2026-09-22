# Changelog

All notable changes to LumaToast are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.1.0] — 2026-09-22

### Added
- `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`, `toast.loading()` — core toast types
- `toast.custom()` — fully customisable toast type
- `toast.promise()` — track async operations with automatic loading → success/error transition
- `toast.update()` — patch an existing toast in-place without re-mounting
- `toast.dismiss()`, `toast.dismissAll()`, `toast.dismissLatest()` — programmatic removal
- `toast.subscribe()` — reactive listener with unsubscribe support
- `toast.configure()` — set global defaults (position, theme, duration, dismissible, maxVisible)
- `initializeRenderer()` — vanilla DOM renderer with support for all 6 screen positions
- Toast queue — toasts beyond `maxVisible` are queued and promoted automatically
- FLIP-style stack animations when toasts enter, exit, or reorder
- Progress bar with per-type colour (green=success, red=error, amber=warning, blue=info)
- Progress bar pauses on hover and resumes on mouse leave
- Swipe-to-dismiss with position-aware direction (horizontal or vertical)
- `Escape` key to dismiss the latest toast
- 9 built-in themes: `linear`, `aurora`, `vision`, `minimal`, `cupertino`, `material`, `terminal`, `github`, `cyberpunk`
- Full ARIA support: `role="alert"/"status"`, `aria-live`, container `aria-live` regions
- Keyboard focus styles on action and close buttons
- `prefers-reduced-motion` media query support — all animations disabled
- Design tokens in `tokens.ts` (durations, timings, layout, CSS class names)
- Animation utilities: `clamp()`, `lerp()`, `mapRange()`, `prefersReducedMotion()`
- Lifecycle helpers: `onEnter()`, `onExit()`
- ESM + CJS dual output via `tsup`
- TypeScript declarations bundled

### Fixed
- Progress bar animation delay accounts for render lag using negative `animationDelay`
- Stack animation skips toasts mid-removal to prevent conflicting transforms
- `aria-live` is `assertive` for error toasts (was `polite`)
- Close button hidden correctly when `dismissible: false`
- `ToastTheme` type now includes all 9 themes (was only 4)

### Internal
- Removed stray `console.log("hello")` from renderer module
- Removed ~150 lines of commented-out dead code
- `tokens.ts` populated with real constants
- `lifecycle.ts` and `animation.ts` implemented (were empty files)

