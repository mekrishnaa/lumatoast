export type Listener<T> = (payload: T) => void;

/**
 * Tiny event emitter used internally by LumaToast.
 */
export class EventEmitter<T> {
    private listeners = new Set<Listener<T>>();

    subscribe(listener: Listener<T>): () => void {
        this.listeners.add(listener);

        // Return unsubscribe function.
        return () => {
            this.listeners.delete(listener);
        };
    }

    emit(payload: T): void {
        this.listeners.forEach((listener) => listener(payload));
    }

    clear(): void {
        this.listeners.clear();
    }
}