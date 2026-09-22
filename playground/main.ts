import "../src/styles/index.css";
import { initializeRenderer, toast } from "../src";
import type {
    ToastTheme,
    ToastPosition,
    ToastAnimationEnter,
    ToastAnimationExit,
    ToastAnimationSpeed,
    ToastProgressPosition,
} from "../src";

// ── Bootstrap ─────────────────────────────────────────────────────────────────

initializeRenderer();

// ── Global state ──────────────────────────────────────────────────────────────

let globalTheme:     ToastTheme          = "linear";
let globalPosition:  ToastPosition       = "top-right";
let globalSpeed:     ToastAnimationSpeed = "normal";
let globalEnter:     ToastAnimationEnter = "slide";
let globalExit:      ToastAnimationExit  = "slide";
let globalProgressPos: ToastProgressPosition = "bottom";

function applyGlobal() {
    toast.configure({
        theme:            globalTheme,
        position:         globalPosition,
        animationSpeed:   globalSpeed,
        animationEnter:   globalEnter,
        animationExit:    globalExit,
        progressPosition: globalProgressPos,
    });
    updateStatusBar();
}

function updateStatusBar() {
    const el = document.getElementById("pg-status");
    if (el) {
        el.textContent =
            `Global: theme=${globalTheme} · position=${globalPosition} · ` +
            `enter=${globalEnter} · exit=${globalExit} · ` +
            `progress=${globalProgressPos} · speed=${globalSpeed}`;
    }
}

// ── Builder helpers ───────────────────────────────────────────────────────────

const root = document.getElementById("pg-root")!;

function section(title: string, content: (el: HTMLElement) => void): void {
    const wrap = document.createElement("div");
    wrap.className = "pg-section";

    const h2 = document.createElement("h2");
    h2.textContent = title;
    wrap.appendChild(h2);

    content(wrap);
    root.appendChild(wrap);
}

function btn(
    label: string,
    className: string,
    onClick: () => void,
    parent: HTMLElement
): HTMLButtonElement {
    const b = document.createElement("button");
    b.className = `pg-btn ${className}`;
    b.textContent = label;
    b.addEventListener("click", onClick);
    parent.appendChild(b);
    return b;
}

function row(parent: HTMLElement): HTMLElement {
    const r = document.createElement("div");
    r.className = "pg-buttons";
    parent.appendChild(r);
    return r;
}

function divider(parent: HTMLElement) {
    const d = document.createElement("div");
    d.className = "pg-divider";
    parent.appendChild(d);
}

function labeledSelect<T extends string>(
    labelText: string,
    options: T[],
    current: T,
    onChange: (val: T) => void,
    parent: HTMLElement
): void {
    const r = document.createElement("div");
    r.className = "pg-row";
    r.style.marginBottom = "8px";

    const lbl = document.createElement("span");
    lbl.className = "pg-label";
    lbl.textContent = labelText;

    const sel = document.createElement("select");
    sel.className = "pg-select";

    options.forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        if (opt === current) o.selected = true;
        sel.appendChild(o);
    });

    sel.addEventListener("change", () => onChange(sel.value as T));

    r.append(lbl, sel);
    parent.appendChild(r);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — Toast Types
// ═══════════════════════════════════════════════════════════════════════════════

section("Toast Types", (s) => {
    const r = row(s);

    btn("✅ Success", "success", () => {
        toast.success("Profile updated successfully.", { title: "Success" });
    }, r);

    btn("❌ Error", "error", () => {
        toast.error("Payment gateway is unavailable.", { title: "Error" });
    }, r);

    btn("⚠️ Warning", "warning", () => {
        toast.warning("Disk space is running low.", { title: "Warning" });
    }, r);

    btn("ℹ️ Info", "info", () => {
        toast.info("A new version is available.", { title: "Info" });
    }, r);

    btn("⏳ Loading", "loading", () => {
        const t = toast.loading("Uploading your file...", { title: "Uploading" });
        setTimeout(() => toast.dismiss(t.id), 4000);
    }, r);

    btn("🎨 Custom", "purple", () => {
        toast.custom("This is a fully custom toast.", {
            title: "Custom",
            style: {
                "--luma-bg":           "linear-gradient(135deg, #1a1a2e, #16213e)",
                "--luma-border-color": "#e040fb",
                "--luma-border-width": "1px",
                "--luma-shadow":       "0 0 24px rgba(224,64,251,.3)",
            }
        });
    }, r);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — With Title & Without
// ═══════════════════════════════════════════════════════════════════════════════

section("Title + Description Variants", (s) => {
    const r = row(s);

    btn("Title + Description", "success", () => {
        toast.success("Your invoice was generated.", { title: "Invoice Ready" });
    }, r);

    btn("Description only", "success", () => {
        toast.success("Saved to cloud storage.");
    }, r);

    btn("Title only", "info", () => {
        toast.info("", { title: "No description" });
    }, r);

    btn("Long message", "warning", () => {
        toast.warning(
            "This is a very long description to test how LumaToast handles text wrapping in the card when the content exceeds a single line.",
            { title: "Long Content" }
        );
    }, r);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — Promise API
// ═══════════════════════════════════════════════════════════════════════════════

section("Promise API", (s) => {
    const r = row(s);

    btn("Promise → Success", "success", () => {
        const p = new Promise<string>((resolve) =>
            setTimeout(() => resolve("done"), 2000)
        );
        toast.promise(p, {
            loading: { title: "Uploading",  description: "Uploading your invoice..." },
            success: { title: "Uploaded",   description: "Invoice uploaded successfully." },
            error:   { title: "Failed",     description: "Upload failed. Try again." },
        });
    }, r);

    btn("Promise → Error", "error", () => {
        const p = new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error("Network error")), 2000)
        ).catch(() => {});

        toast.promise(
            new Promise<void>((_, reject) =>
                setTimeout(() => reject(new Error("fail")), 2000)
            ),
            {
                loading: { title: "Saving",   description: "Saving your work..." },
                success: { title: "Saved",    description: "All changes saved." },
                error:   { title: "Error",    description: "Failed to save changes." },
            }
        ).catch(() => {});
    }, r);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — Update Toast
// ═══════════════════════════════════════════════════════════════════════════════

section("toast.update()", (s) => {
    const r = row(s);

    btn("Loading → Success", "success", () => {
        const t = toast.loading("Processing payment...", { title: "Processing" });
        setTimeout(() => {
            toast.update(t.id, {
                type: "success",
                title: "Payment Complete",
                description: "Your payment was processed.",
                duration: 4000,
                dismissible: true,
            });
        }, 2000);
    }, r);

    btn("Loading → Error", "error", () => {
        const t = toast.loading("Verifying card...", { title: "Verifying" });
        setTimeout(() => {
            toast.update(t.id, {
                type: "error",
                title: "Card Declined",
                description: "Please check your card details.",
                duration: 5000,
                dismissible: true,
            });
        }, 2000);
    }, r);

    btn("Success → Warning", "warning", () => {
        const t = toast.success("File uploaded.");
        setTimeout(() => {
            toast.update(t.id, {
                type: "warning",
                title: "Quota Warning",
                description: "You're at 90% of your storage quota.",
                duration: 5000,
            });
        }, 1500);
    }, r);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — Action Button Variants
// ═══════════════════════════════════════════════════════════════════════════════

section("Action Button Variants", (s) => {
    const r = row(s);

    btn("Solid (default)", "success", () => {
        toast.success("Your invoice was archived.", {
            title: "Archived",
            duration: 6000,
            action: {
                label: "Undo",
                variant: "solid",
                onClick: () => toast.info("Undo triggered!"),
            },
        });
    }, r);

    btn("Outline", "info", () => {
        toast.info("New comment on your post.", {
            title: "Comment",
            duration: 6000,
            action: {
                label: "View",
                variant: "outline",
                onClick: () => toast.success("Navigating..."),
            },
        });
    }, r);

    btn("Ghost", "warning", () => {
        toast.warning("Session will expire in 5 minutes.", {
            title: "Session",
            duration: 6000,
            action: {
                label: "Renew",
                variant: "ghost",
                onClick: () => toast.success("Session renewed!"),
            },
        });
    }, r);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — Progress Bar
// ═══════════════════════════════════════════════════════════════════════════════

section("Progress Bar", (s) => {
    const r = row(s);

    btn("Bottom (default)", "success", () => {
        toast.success("Saving to cloud...", { duration: 5000, progressPosition: "bottom" });
    }, r);

    btn("Top placement", "success", () => {
        toast.success("Saving to cloud...", { duration: 5000, progressPosition: "top" });
    }, r);

    btn("Custom color (CSS var)", "info", () => {
        toast.info("Processing request...", {
            duration: 5000,
            style: { "--luma-progress-info": "linear-gradient(90deg, #f59e0b, #ef4444)" },
        });
    }, r);

    btn("Thick bar (6px)", "warning", () => {
        toast.warning("Uploading...", {
            duration: 5000,
            style: { "--luma-progress-height": "6px", "--luma-progress-radius": "3px" },
        });
    }, r);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — Animations (Enter)
// ═══════════════════════════════════════════════════════════════════════════════

section("Enter Animations", (s) => {
    const animations: ToastAnimationEnter[] = ["slide", "fade", "scale", "bounce", "none"];

    const r = row(s);

    animations.forEach((anim) => {
        btn(anim, "", () => {
            toast.success(`Enter: ${anim}`, {
                title: anim.charAt(0).toUpperCase() + anim.slice(1),
                animationEnter: anim,
            });
        }, r);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — Animations (Exit)
// ═══════════════════════════════════════════════════════════════════════════════

section("Exit Animations", (s) => {
    const animations: ToastAnimationExit[] = ["slide", "fade", "none"];

    const r = row(s);

    animations.forEach((anim) => {
        btn(anim, "", () => {
            toast.info(`Exit: ${anim} — hover and wait or close`, {
                animationExit: anim,
                duration: 3000,
            });
        }, r);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 9 — Show Icon / Close on Click
// ═══════════════════════════════════════════════════════════════════════════════

section("Icon & Dismiss Behaviour", (s) => {
    const r = row(s);

    btn("With icon (default)", "success", () => {
        toast.success("Icon is visible by default.", { showIcon: true });
    }, r);

    btn("Without icon", "info", () => {
        toast.info("No icon on this one.", { showIcon: false });
    }, r);

    btn("Close on click", "warning", () => {
        toast.warning("Click anywhere on this card to dismiss.", {
            title: "Click to dismiss",
            closeOnClick: true,
            duration: 10000,
        });
    }, r);

    btn("No close button", "error", () => {
        toast.error("This toast has no close button.", {
            dismissible: false,
            duration: 3000,
        });
    }, r);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 10 — Custom Style (inline CSS vars)
// ═══════════════════════════════════════════════════════════════════════════════

section("Inline Style Overrides", (s) => {
    const r = row(s);

    btn("Custom background", "purple", () => {
        toast.success("Custom gradient background.", {
            title: "Custom BG",
            style: {
                "--luma-bg":     "linear-gradient(135deg, #1a1a2e, #16213e)",
                "--luma-shadow": "0 0 30px rgba(138,43,226,.4)",
            },
        });
    }, r);

    btn("Custom typography", "info", () => {
        toast.info("Poppins font, bigger title.", {
            title: "Typography",
            style: {
                "--luma-font":         '"Poppins", sans-serif',
                "--luma-title-size":   "17px",
                "--luma-title-weight": "800",
                "--luma-line-height":  "1.6",
            },
        });
    }, r);

    btn("Pill shape", "success", () => {
        toast.success("Look, I'm a pill!", {
            style: {
                "--luma-radius":  "999px",
                "--luma-padding": "10px 20px",
            },
        });
    }, r);

    btn("Brand colors", "warning", () => {
        toast.warning("Custom brand palette.", {
            title: "Brand",
            style: {
                "--luma-bg":             "#0f172a",
                "--luma-border-color":   "#f97316",
                "--luma-title-color":    "#f97316",
                "--luma-desc-color":     "#fed7aa",
                "--luma-progress-warning": "#f97316",
                "--luma-action-color":   "#f97316",
            },
            action: {
                label: "Learn more",
                variant: "ghost",
                onClick: () => {},
            }
        });
    }, r);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 11 — Custom className
// ═══════════════════════════════════════════════════════════════════════════════

// Inject a custom class into the page head
const styleTag = document.createElement("style");
styleTag.textContent = `
    .my-custom-toast .luma-toast-card {
        background: linear-gradient(135deg, #064e3b, #065f46) !important;
        border: 1px solid #10b981 !important;
        box-shadow: 0 0 20px rgba(16,185,129,.3) !important;
    }
    .my-brand-toast .luma-toast-card {
        background: #1e1b4b !important;
        border: 1px solid #818cf8 !important;
        --luma-title-color: #a5b4fc;
        --luma-desc-color:  rgba(165,180,252,.7);
    }
`;
document.head.appendChild(styleTag);

section("Custom className", (s) => {
    const r = row(s);

    btn("Emerald class", "success", () => {
        toast.success("Using a custom CSS class for emerald styling.", {
            title: "className Demo",
            className: "my-custom-toast",
        });
    }, r);

    btn("Indigo brand class", "purple", () => {
        toast.info("Custom indigo brand styling via className.", {
            title: "Brand Toast",
            className: "my-brand-toast",
        });
    }, r);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 12 — Themes
// ═══════════════════════════════════════════════════════════════════════════════

section("Themes", (s) => {
    const themes: ToastTheme[] = [
        "linear", "aurora", "vision", "minimal",
        "cupertino", "material", "terminal", "github", "cyberpunk"
    ];

    const r = row(s);

    themes.forEach((theme) => {
        btn(theme, "", () => {
            toast.success(`Theme: ${theme}`, {
                title: theme.charAt(0).toUpperCase() + theme.slice(1),
                theme,
                duration: 5000,
            });
        }, r);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 13 — Positions
// ═══════════════════════════════════════════════════════════════════════════════

section("Positions", (s) => {
    const positions: ToastPosition[] = [
        "top-left", "top-center", "top-right",
        "bottom-left", "bottom-center", "bottom-right",
    ];

    const r = row(s);

    positions.forEach((pos) => {
        btn(pos, "", () => {
            toast.success(`Position: ${pos}`, { position: pos, duration: 3000 });
        }, r);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 14 — Queue & Dismiss Controls
// ═══════════════════════════════════════════════════════════════════════════════

section("Queue & Dismiss", (s) => {
    const r = row(s);

    btn("Fire 6 toasts (queue test)", "info", () => {
        for (let i = 1; i <= 6; i++) {
            toast.success(`Toast #${i}`, { title: `Batch ${i}`, duration: 6000 });
        }
    }, r);

    btn("Dismiss Latest", "warning", () => {
        toast.dismissLatest();
    }, r);

    btn("Dismiss All", "danger", () => {
        toast.dismissAll();
    }, r);

    divider(s);

    const subRow = row(s);

    btn("Persistent (no auto-dismiss)", "loading", () => {
        const t = toast.loading("I won't go away by myself...", {
            title: "Persistent",
        });

        const killBtn = document.createElement("button");
        killBtn.className = "pg-btn danger";
        killBtn.textContent = `Dismiss (${t.id.slice(-4)})`;
        killBtn.addEventListener("click", () => {
            toast.dismiss(t.id);
            killBtn.remove();
        });
        subRow.appendChild(killBtn);
    }, subRow);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 15 — Global configure()
// ═══════════════════════════════════════════════════════════════════════════════

section("Global configure()", (s) => {
    // Theme
    labeledSelect<ToastTheme>(
        "Theme",
        ["linear", "aurora", "vision", "minimal", "cupertino", "material", "terminal", "github", "cyberpunk"],
        globalTheme,
        (v) => { globalTheme = v; applyGlobal(); },
        s
    );

    // Position
    labeledSelect<ToastPosition>(
        "Position",
        ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"],
        globalPosition,
        (v) => { globalPosition = v; applyGlobal(); },
        s
    );

    // Enter
    labeledSelect<ToastAnimationEnter>(
        "Enter",
        ["slide", "fade", "scale", "bounce", "none"],
        globalEnter,
        (v) => { globalEnter = v; applyGlobal(); },
        s
    );

    // Exit
    labeledSelect<ToastAnimationExit>(
        "Exit",
        ["slide", "fade", "none"],
        globalExit,
        (v) => { globalExit = v; applyGlobal(); },
        s
    );

    // Progress position
    labeledSelect<ToastProgressPosition>(
        "Progress",
        ["bottom", "top"],
        globalProgressPos,
        (v) => { globalProgressPos = v; applyGlobal(); },
        s
    );

    // Speed
    labeledSelect<ToastAnimationSpeed>(
        "Speed",
        ["slow", "normal", "fast"],
        globalSpeed,
        (v) => { globalSpeed = v; applyGlobal(); },
        s
    );

    divider(s);

    const r = row(s);

    btn("Fire test toast", "success", () => {
        toast.success("Global config applied!", {
            title: `Theme: ${globalTheme}`,
            duration: 4000,
            action: {
                label: "Nice",
                variant: "solid",
                onClick: () => {},
            },
        });
    }, r);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 16 — Duration variants
// ═══════════════════════════════════════════════════════════════════════════════

section("Duration Variants", (s) => {
    const r = row(s);

    btn("2s (short)", "info", () => {
        toast.info("Gone in 2 seconds.", { duration: 2000 });
    }, r);

    btn("4s (default)", "info", () => {
        toast.info("Gone in 4 seconds.", { duration: 4000 });
    }, r);

    btn("8s (long)", "warning", () => {
        toast.warning("I'll be here for 8 seconds.", { duration: 8000 });
    }, r);

    btn("Infinite", "loading", () => {
        const t = toast.loading("I stay until you dismiss me.", { title: "Persistent" });
        setTimeout(() => toast.dismiss(t.id), 15000);
    }, r);
});

// Initialize global config
applyGlobal();