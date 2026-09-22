import { describe, it, expect, vi, beforeEach } from "vitest";
import { ToastManager, configure } from "../src/core/manager";
import { toast, toastManager } from "../src/core/toast";

// ── ToastManager unit tests ───────────────────────────────────────────────────

describe("ToastManager", () => {
    let manager: ToastManager;

    beforeEach(() => {
        manager = new ToastManager();
    });

    // --- create ---

    it("creates a success toast with correct fields", () => {
        const t = manager.create("success", { description: "Saved!" });

        expect(manager.getToasts()).toHaveLength(1);
        expect(t.type).toBe("success");
        expect(t.description).toBe("Saved!");
        expect(t.visible).toBe(true);
        expect(t.id).toMatch(/^toast-/);
    });

    it("creates a toast with a custom id", () => {
        const t = manager.create("info", { id: "my-toast" });
        expect(t.id).toBe("my-toast");
    });

    it("sets default duration and dismissible flags", () => {
        const t = manager.create("info", {});
        expect(t.duration).toBeTypeOf("number");
        expect(t.dismissible).toBe(true);
    });

    it("applies default customization options", () => {
        const t = manager.create("info", {});
        expect(t.showIcon).toBe(true);
        expect(t.closeOnClick).toBe(false);
        expect(t.progressPosition).toBe("bottom");
        expect(t.animationEnter).toBe("slide");
        expect(t.animationExit).toBe("slide");
    });

    it("applies per-toast customization options", () => {
        const t = manager.create("success", {
            showIcon:         false,
            closeOnClick:     true,
            progressPosition: "top",
            animationEnter:   "bounce",
            animationExit:    "fade",
            className:        "my-toast",
            style:            { "--luma-bg": "red" },
        });

        expect(t.showIcon).toBe(false);
        expect(t.closeOnClick).toBe(true);
        expect(t.progressPosition).toBe("top");
        expect(t.animationEnter).toBe("bounce");
        expect(t.animationExit).toBe("fade");
        expect(t.className).toBe("my-toast");
        expect(t.style).toEqual({ "--luma-bg": "red" });
    });

    // --- action variant ---

    it("stores action with variant", () => {
        const t = manager.create("info", {
            action: {
                label: "Undo",
                onClick: vi.fn(),
                variant: "outline",
            }
        });
        expect(t.action?.variant).toBe("outline");
    });

    // --- dismiss ---

    it("dismisses a toast by id", () => {
        const t = manager.create("info", { description: "Hello" });
        manager.dismiss(t.id);
        expect(manager.getToasts()).toHaveLength(0);
    });

    it("does nothing when dismissing a non-existent id", () => {
        manager.create("info", {});
        expect(() => manager.dismiss("ghost-id")).not.toThrow();
        expect(manager.getToasts()).toHaveLength(1);
    });

    // --- dismissAll ---

    it("dismissAll removes all visible toasts", () => {
        manager.create("success", {});
        manager.create("error", {});
        manager.create("info", {});
        manager.dismissAll();
        expect(manager.getToasts()).toHaveLength(0);
    });

    // --- dismissLatest ---

    it("dismissLatest removes the most recently added toast", () => {
        const t1 = manager.create("success", { description: "first" });
        manager.create("error", { description: "second" });
        manager.dismissLatest();

        const remaining = manager.getToasts();
        expect(remaining).toHaveLength(1);
        expect(remaining[0].id).toBe(t1.id);
    });

    it("dismissLatest is a no-op when no toasts exist", () => {
        expect(() => manager.dismissLatest()).not.toThrow();
    });

    // --- queue ---

    it("queues toasts beyond maxVisible (default 5)", () => {
        for (let i = 0; i < 5; i++) {
            manager.create("info", { description: `toast ${i}` });
        }

        expect(manager.getToasts()).toHaveLength(5);

        const queued = manager.create("info", { description: "queued" });
        expect(manager.getToasts().find((t) => t.id === queued.id)).toBeUndefined();
    });

    it("promotes queued toast when a visible toast is dismissed", () => {
        for (let i = 0; i < 5; i++) {
            manager.create("info", {});
        }

        const queued = manager.create("warning", { description: "I was queued" });

        manager.dismiss(manager.getToasts()[0].id);

        const visible = manager.getToasts();
        expect(visible).toHaveLength(5);
        expect(visible.find((t) => t.id === queued.id)).toBeDefined();
    });

    // --- update ---

    it("updates a visible toast's fields", () => {
        const t = manager.create("loading", { description: "Loading..." });
        manager.update(t.id, { type: "success", description: "Done!" });

        const updated = manager.getToasts().find((x) => x.id === t.id);
        expect(updated?.type).toBe("success");
        expect(updated?.description).toBe("Done!");
    });

    it("resets createdAt when duration is updated", () => {
        const t = manager.create("info", {});
        const before = t.createdAt;

        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        return sleep(5).then(() => {
            manager.update(t.id, { duration: 2000 });
            const updated = manager.getToasts().find((x) => x.id === t.id);
            expect(updated!.createdAt).toBeGreaterThan(before);
        });
    });

    it("returns null when updating a non-existent id", () => {
        const result = manager.update("nope", { description: "x" });
        expect(result).toBeNull();
    });

    it("can update className and style", () => {
        const t = manager.create("info", {});
        manager.update(t.id, { className: "updated-class", style: { color: "red" } });
        const updated = manager.getToasts().find((x) => x.id === t.id);
        expect(updated?.className).toBe("updated-class");
        expect(updated?.style).toEqual({ color: "red" });
    });

    it("can update progressPosition", () => {
        const t = manager.create("info", {});
        manager.update(t.id, { progressPosition: "top" });
        const updated = manager.getToasts().find((x) => x.id === t.id);
        expect(updated?.progressPosition).toBe("top");
    });

    // --- subscribe / EventEmitter ---

    it("notifies subscribers when a toast is created", () => {
        const listener = vi.fn();
        manager.changes.subscribe(listener);
        manager.create("success", {});
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("notifies subscribers when a toast is dismissed", () => {
        const listener = vi.fn();
        const t = manager.create("info", {});
        manager.changes.subscribe(listener);
        manager.dismiss(t.id);
        expect(listener).toHaveBeenCalledOnce();
        expect(listener).toHaveBeenCalledWith([]);
    });

    it("unsubscribe stops future notifications", () => {
        const listener = vi.fn();
        const unsub = manager.changes.subscribe(listener);
        unsub();
        manager.create("info", {});
        expect(listener).not.toHaveBeenCalled();
    });
});

// ── toast public API ──────────────────────────────────────────────────────────

describe("toast API", () => {
    beforeEach(() => {
        toastManager.dismissAll();
        // Reset global config to defaults
        configure({
            position:         "top-right",
            theme:            "linear",
            duration:         4000,
            dismissible:      true,
            showIcon:         true,
            closeOnClick:     false,
            progressPosition: "bottom",
            animationEnter:   "slide",
            animationExit:    "slide",
        });
    });

    it("toast.success creates a success toast", () => {
        toast.success("Saved!");
        const toasts = toastManager.getToasts();
        expect(toasts[0].type).toBe("success");
        expect(toasts[0].description).toBe("Saved!");
    });

    it("toast.error creates an error toast", () => {
        toast.error("Failed!");
        expect(toastManager.getToasts()[0].type).toBe("error");
    });

    it("toast.warning creates a warning toast", () => {
        toast.warning("Watch out!");
        expect(toastManager.getToasts()[0].type).toBe("warning");
    });

    it("toast.info creates an info toast", () => {
        toast.info("FYI");
        expect(toastManager.getToasts()[0].type).toBe("info");
    });

    it("toast.loading creates a toast with Infinity duration and not dismissible", () => {
        const t = toast.loading("Uploading...");
        expect(t.duration).toBe(Infinity);
        expect(t.dismissible).toBe(false);
    });

    it("toast.custom creates a custom toast", () => {
        const t = toast.custom("Hey!", { theme: "cyberpunk" });
        expect(t.type).toBe("custom");
        expect(t.theme).toBe("cyberpunk");
    });

    it("toast.success accepts progressPosition: top", () => {
        const t = toast.success("Done!", { progressPosition: "top" });
        expect(t.progressPosition).toBe("top");
    });

    it("toast.info accepts animationEnter: bounce", () => {
        const t = toast.info("Hey", { animationEnter: "bounce" });
        expect(t.animationEnter).toBe("bounce");
    });

    it("toast.success accepts className and style", () => {
        const t = toast.success("Test", {
            className: "my-class",
            style: { "--luma-radius": "24px" }
        });
        expect(t.className).toBe("my-class");
        expect(t.style).toEqual({ "--luma-radius": "24px" });
    });

    it("toast.success accepts showIcon: false", () => {
        const t = toast.success("No icon", { showIcon: false });
        expect(t.showIcon).toBe(false);
    });

    it("toast.success accepts closeOnClick: true", () => {
        const t = toast.success("Click me", { closeOnClick: true });
        expect(t.closeOnClick).toBe(true);
    });

    it("toast.success accepts action with variant", () => {
        const t = toast.success("With action", {
            action: { label: "Undo", onClick: vi.fn(), variant: "ghost" }
        });
        expect(t.action?.variant).toBe("ghost");
    });

    it("toast.dismiss removes a toast", () => {
        const t = toast.success("test");
        toast.dismiss(t.id);
        expect(toastManager.getToasts()).toHaveLength(0);
    });

    it("toast.dismissAll clears everything", () => {
        toast.success("a");
        toast.error("b");
        toast.dismissAll();
        expect(toastManager.getToasts()).toHaveLength(0);
    });

    it("toast.subscribe returns an unsubscribe function", () => {
        const listener = vi.fn();
        const unsub = toast.subscribe(listener);
        toast.success("test");
        expect(listener).toHaveBeenCalled();
        unsub();
        toast.success("after");
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("toast.promise resolves and updates to success", async () => {
        const p = Promise.resolve("ok");
        const result = await toast.promise(p, {
            loading: { description: "Loading..." },
            success: { description: "Done!" },
            error:   { description: "Oops!" }
        });

        expect(result).toBe("ok");

        const t = toastManager.getToasts()[0];
        expect(t.type).toBe("success");
        expect(t.description).toBe("Done!");
    });

    it("toast.promise rejects and updates to error", async () => {
        const p = Promise.reject(new Error("fail"));
        try {
            await toast.promise(p, {
                loading: { description: "Loading..." },
                success: { description: "Done!" },
                error:   { description: "It failed!" }
            });
        } catch {
            // expected
        }

        const t = toastManager.getToasts()[0];
        expect(t.type).toBe("error");
        expect(t.description).toBe("It failed!");
    });
});

// ── configure() global defaults ───────────────────────────────────────────────

describe("configure()", () => {
    it("sets a global default theme", () => {
        configure({ theme: "aurora" });
        const m = new ToastManager();
        const t = m.create("info", {});
        expect(t.theme).toBe("aurora");
        configure({ theme: "linear" });
    });

    it("per-toast options override global defaults", () => {
        configure({ position: "bottom-left" });
        const m = new ToastManager();
        const t = m.create("info", { position: "top-right" });
        expect(t.position).toBe("top-right");
        configure({ position: "top-right" });
    });

    it("sets global showIcon: false", () => {
        configure({ showIcon: false });
        const m = new ToastManager();
        const t = m.create("success", {});
        expect(t.showIcon).toBe(false);
        configure({ showIcon: true });
    });

    it("sets global closeOnClick: true", () => {
        configure({ closeOnClick: true });
        const m = new ToastManager();
        const t = m.create("info", {});
        expect(t.closeOnClick).toBe(true);
        configure({ closeOnClick: false });
    });

    it("sets global progressPosition: top", () => {
        configure({ progressPosition: "top" });
        const m = new ToastManager();
        const t = m.create("info", {});
        expect(t.progressPosition).toBe("top");
        configure({ progressPosition: "bottom" });
    });

    it("sets global animationEnter: scale", () => {
        configure({ animationEnter: "scale" });
        const m = new ToastManager();
        const t = m.create("info", {});
        expect(t.animationEnter).toBe("scale");
        configure({ animationEnter: "slide" });
    });

    it("sets global animationExit: fade", () => {
        configure({ animationExit: "fade" });
        const m = new ToastManager();
        const t = m.create("info", {});
        expect(t.animationExit).toBe("fade");
        configure({ animationExit: "slide" });
    });
});