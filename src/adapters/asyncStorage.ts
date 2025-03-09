import type { StorageAdapter } from "../types.js";

/**
 * Interface for AsyncStorage-like objects
 */
interface AsyncStorageInterface {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): Promise<void>;
	removeItem(key: string): Promise<void>;
	clear(): Promise<void>;
}

/**
 * Storage adapter for React Native's AsyncStorage
 * Note: This adapter requires @react-native-async-storage/async-storage to be installed
 */
export class AsyncStorageAdapter implements StorageAdapter {
	constructor(private asyncStorage: AsyncStorageInterface) {}

	async getItem(key: string): Promise<string | null> {
		return await this.asyncStorage.getItem(key);
	}

	async setItem(key: string, value: string): Promise<void> {
		await this.asyncStorage.setItem(key, value);
	}

	async removeItem(key: string): Promise<void> {
		await this.asyncStorage.removeItem(key);
	}

	async clear(): Promise<void> {
		await this.asyncStorage.clear();
	}
}
