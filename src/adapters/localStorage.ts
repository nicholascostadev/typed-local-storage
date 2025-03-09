import type { StorageAdapter } from "../types.js";

/**
 * Storage adapter for browser's localStorage
 */
export class LocalStorageAdapter implements StorageAdapter {
	getItem(key: string): string | null {
		return localStorage.getItem(key);
	}

	setItem(key: string, value: string): void {
		localStorage.setItem(key, value);
	}

	removeItem(key: string): void {
		localStorage.removeItem(key);
	}

	clear(): void {
		localStorage.clear();
	}
}
