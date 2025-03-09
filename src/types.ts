/**
 * Interface for storage adapters
 *
 * This allows the library to work with different storages
 */
export interface StorageAdapter {
	/**
	 * Get an item from storage
	 * @param key - The key to retrieve
	 * @returns The stored value or null if not found
	 */
	getItem(key: string): string | null | Promise<string | null>;

	/**
	 * Set an item in storage
	 * @param key - The key to set
	 * @param value - The value to store
	 */
	setItem(key: string, value: string): void | Promise<void>;

	/**
	 * Remove an item from storage
	 * @param key - The key to remove
	 */
	removeItem(key: string): void | Promise<void>;

	/**
	 * Clear all items from storage
	 */
	clear(): void | Promise<void>;
}
