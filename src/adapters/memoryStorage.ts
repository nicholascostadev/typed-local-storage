import type { StorageAdapter } from "../types.js";

/**
 * In-memory storage adapter for testing or environments without localStorage
 */
export class MemoryStorageAdapter implements StorageAdapter {
	private storage = new Map<string, string>();

	getItem(key: string): string | null {
		return this.storage.get(key) ?? null;
	}

	setItem(key: string, value: string): void {
		this.storage.set(key, value);
	}

	removeItem(key: string): void {
		this.storage.delete(key);
	}

	clear(): void {
		this.storage.clear();
	}
}
