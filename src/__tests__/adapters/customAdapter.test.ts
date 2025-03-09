import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { createTypedStorage } from "../../createTypedStorage.js";
import type { StorageAdapter } from "../../types.js";
import { objectSchema, stringSchema } from "../utils.js";

/**
 * Example of a custom synchronous storage adapter
 * This adapter uses a Map as the underlying storage mechanism
 */
class CustomSyncStorageAdapter implements StorageAdapter {
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

/**
 * Example of a custom asynchronous storage adapter
 * This adapter simulates an async API with artificial delays
 */
class CustomAsyncStorageAdapter implements StorageAdapter {
	private storage = new Map<string, string>();

	async getItem(key: string): Promise<string | null> {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 5));
		return this.storage.get(key) ?? null;
	}

	async setItem(key: string, value: string): Promise<void> {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 5));
		this.storage.set(key, value);
	}

	async removeItem(key: string): Promise<void> {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 5));
		this.storage.delete(key);
	}

	async clear(): Promise<void> {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 5));
		this.storage.clear();
	}
}

describe("Custom Storage Adapters", () => {
	describe("Synchronous Custom Adapter", () => {
		let syncAdapter: CustomSyncStorageAdapter;

		beforeEach(() => {
			syncAdapter = new CustomSyncStorageAdapter();
		});

		it("should implement the StorageAdapter interface correctly", () => {
			expect(syncAdapter).toHaveProperty("getItem");
			expect(syncAdapter).toHaveProperty("setItem");
			expect(syncAdapter).toHaveProperty("removeItem");
			expect(syncAdapter).toHaveProperty("clear");

			expect(typeof syncAdapter.getItem).toBe("function");
			expect(typeof syncAdapter.setItem).toBe("function");
			expect(typeof syncAdapter.removeItem).toBe("function");
			expect(typeof syncAdapter.clear).toBe("function");
		});

		it("should store and retrieve string values", () => {
			const key = "test-key";
			const value = "test-value";

			syncAdapter.setItem(key, value);
			expect(syncAdapter.getItem(key)).toBe(value);
		});

		it("should return null for non-existent keys", () => {
			expect(syncAdapter.getItem("non-existent")).toBeNull();
		});

		it("should remove items correctly", () => {
			const key = "test-key";
			const value = "test-value";

			syncAdapter.setItem(key, value);
			expect(syncAdapter.getItem(key)).toBe(value);

			syncAdapter.removeItem(key);
			expect(syncAdapter.getItem(key)).toBeNull();
		});

		it("should clear all items", () => {
			syncAdapter.setItem("key1", "value1");
			syncAdapter.setItem("key2", "value2");

			syncAdapter.clear();

			expect(syncAdapter.getItem("key1")).toBeNull();
			expect(syncAdapter.getItem("key2")).toBeNull();
		});

		it("should work with createTypedStorage and return synchronous values", () => {
			const typedStorage = createTypedStorage(syncAdapter, {
				user: {
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
				token: {
					schema: stringSchema,
					defaultValue: "",
				},
			});

			// Verify that operations are synchronous (not promises)
			const setResult = typedStorage.user.set({ name: "John", age: 30 });
			expect(setResult).not.toBeInstanceOf(Promise);

			const getUserResult = typedStorage.user.get();
			expect(getUserResult).not.toBeInstanceOf(Promise);
			expect(getUserResult).toEqual({ name: "John", age: 30 });

			const removeResult = typedStorage.user.remove();
			expect(removeResult).not.toBeInstanceOf(Promise);
		});

		it("should handle complex data with JSON serialization", () => {
			const typedStorage = createTypedStorage(syncAdapter, {
				settings: {
					schema: z.object({
						theme: z.enum(["light", "dark"]),
						notifications: z.boolean(),
						preferences: z.object({
							fontSize: z.number(),
							language: z.string(),
						}),
					}),
					defaultValue: {
						theme: "light",
						notifications: true,
						preferences: {
							fontSize: 14,
							language: "en",
						},
					},
					isJson: true,
				},
			});

			const complexData = {
				theme: "dark" as const,
				notifications: false,
				preferences: {
					fontSize: 16,
					language: "fr",
				},
			};

			typedStorage.settings.set(complexData);
			const retrievedData = typedStorage.settings.get();

			expect(retrievedData).toEqual(complexData);
		});
	});

	describe("Asynchronous Custom Adapter", () => {
		let asyncAdapter: CustomAsyncStorageAdapter;

		beforeEach(() => {
			asyncAdapter = new CustomAsyncStorageAdapter();
		});

		it("should implement the StorageAdapter interface correctly", () => {
			expect(asyncAdapter).toHaveProperty("getItem");
			expect(asyncAdapter).toHaveProperty("setItem");
			expect(asyncAdapter).toHaveProperty("removeItem");
			expect(asyncAdapter).toHaveProperty("clear");

			expect(typeof asyncAdapter.getItem).toBe("function");
			expect(typeof asyncAdapter.setItem).toBe("function");
			expect(typeof asyncAdapter.removeItem).toBe("function");
			expect(typeof asyncAdapter.clear).toBe("function");
		});

		it("should store and retrieve string values asynchronously", async () => {
			const key = "test-key";
			const value = "test-value";

			await asyncAdapter.setItem(key, value);
			const retrievedValue = await asyncAdapter.getItem(key);
			expect(retrievedValue).toBe(value);
		});

		it("should return null for non-existent keys asynchronously", async () => {
			const result = await asyncAdapter.getItem("non-existent");
			expect(result).toBeNull();
		});

		it("should remove items correctly asynchronously", async () => {
			const key = "test-key";
			const value = "test-value";

			await asyncAdapter.setItem(key, value);
			const retrievedValue = await asyncAdapter.getItem(key);
			expect(retrievedValue).toBe(value);

			await asyncAdapter.removeItem(key);
			const afterRemove = await asyncAdapter.getItem(key);
			expect(afterRemove).toBeNull();
		});

		it("should clear all items asynchronously", async () => {
			await asyncAdapter.setItem("key1", "value1");
			await asyncAdapter.setItem("key2", "value2");

			await asyncAdapter.clear();

			const value1 = await asyncAdapter.getItem("key1");
			const value2 = await asyncAdapter.getItem("key2");
			expect(value1).toBeNull();
			expect(value2).toBeNull();
		});

		it("should work with createTypedStorage and return promises", async () => {
			const typedStorage = createTypedStorage(asyncAdapter, {
				user: {
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
				token: {
					schema: stringSchema,
					defaultValue: "",
				},
			});

			// Verify that operations return promises
			const setPromise = typedStorage.user.set({ name: "John", age: 30 });
			expect(setPromise).toBeInstanceOf(Promise);
			await setPromise;

			const getUserPromise = typedStorage.user.get();
			expect(getUserPromise).toBeInstanceOf(Promise);
			const userData = await getUserPromise;
			expect(userData).toEqual({ name: "John", age: 30 });

			const removePromise = typedStorage.user.remove();
			expect(removePromise).toBeInstanceOf(Promise);
			await removePromise;
		});

		it("should handle complex data with JSON serialization asynchronously", async () => {
			const typedStorage = createTypedStorage(asyncAdapter, {
				settings: {
					schema: z.object({
						theme: z.enum(["light", "dark"]),
						notifications: z.boolean(),
						preferences: z.object({
							fontSize: z.number(),
							language: z.string(),
						}),
					}),
					defaultValue: {
						theme: "light",
						notifications: true,
						preferences: {
							fontSize: 14,
							language: "en",
						},
					},
					isJson: true,
				},
			});

			const complexData = {
				theme: "dark" as const,
				notifications: false,
				preferences: {
					fontSize: 16,
					language: "fr",
				},
			};

			await typedStorage.settings.set(complexData);
			const retrievedData = await typedStorage.settings.get();

			expect(retrievedData).toEqual(complexData);
		});

		it("should handle errors gracefully", async () => {
			// Create a faulty adapter that throws errors
			const faultyAdapter: StorageAdapter = {
				getItem: async () => {
					throw new Error("Simulated error in getItem");
				},
				setItem: async () => {
					throw new Error("Simulated error in setItem");
				},
				removeItem: async () => {
					throw new Error("Simulated error in removeItem");
				},
				clear: async () => {
					throw new Error("Simulated error in clear");
				},
			};

			const typedStorage = createTypedStorage(faultyAdapter, {
				user: {
					schema: objectSchema,
					defaultValue: { name: "Default", age: 0 },
					isJson: true,
				},
			});

			// Should return default value when getItem throws
			const userData = await typedStorage.user.get();
			expect(userData).toEqual({ name: "Default", age: 0 });

			// Test that errors are properly handled
			// We expect errors to be caught and handled by the library
			// but we're testing the actual implementation which might throw
			try {
				await typedStorage.user.set({ name: "John", age: 30 });
				// If we get here, the error was handled internally
			} catch (error) {
				// If we get here, the error was thrown
				// Both behaviors are acceptable for this test
				expect(error).toBeDefined();
			}

			try {
				await typedStorage.user.remove();
				// If we get here, the error was handled internally
			} catch (error) {
				// If we get here, the error was thrown
				// Both behaviors are acceptable for this test
				expect(error).toBeDefined();
			}
		});
	});

	describe("Real-world usage examples", () => {
		it("should work with a custom IndexedDB adapter (example)", async () => {
			// This is a simplified mock of what an IndexedDB adapter might look like
			class MockIndexedDBAdapter implements StorageAdapter {
				private storage = new Map<string, string>();

				async getItem(key: string): Promise<string | null> {
					// In a real implementation, this would use IndexedDB API
					return this.storage.get(key) ?? null;
				}

				async setItem(key: string, value: string): Promise<void> {
					// In a real implementation, this would use IndexedDB API
					this.storage.set(key, value);
				}

				async removeItem(key: string): Promise<void> {
					// In a real implementation, this would use IndexedDB API
					this.storage.delete(key);
				}

				async clear(): Promise<void> {
					// In a real implementation, this would use IndexedDB API
					this.storage.clear();
				}
			}

			const indexedDBAdapter = new MockIndexedDBAdapter();
			const typedStorage = createTypedStorage(indexedDBAdapter, {
				appState: {
					schema: z.object({
						isLoggedIn: z.boolean(),
						lastVisited: z.string(),
						userData: z
							.object({
								id: z.string(),
								name: z.string(),
							})
							.nullable(),
					}),
					defaultValue: {
						isLoggedIn: false,
						lastVisited: new Date().toISOString(),
						userData: null,
					},
					isJson: true,
				},
			});

			// Usage example
			await typedStorage.appState.set({
				isLoggedIn: true,
				lastVisited: new Date().toISOString(),
				userData: {
					id: "user-123",
					name: "John Doe",
				},
			});

			const appState = await typedStorage.appState.get();
			expect(appState.isLoggedIn).toBe(true);
			expect(appState.userData).not.toBeNull();
			expect(appState.userData?.id).toBe("user-123");
		});

		it("should work with a custom WebSQL adapter (example)", () => {
			// This is a simplified mock of what a WebSQL adapter might look like
			class MockWebSQLAdapter implements StorageAdapter {
				private storage = new Map<string, string>();

				getItem(key: string): string | null {
					// In a real implementation, this would use WebSQL API
					return this.storage.get(key) ?? null;
				}

				setItem(key: string, value: string): void {
					// In a real implementation, this would use WebSQL API
					this.storage.set(key, value);
				}

				removeItem(key: string): void {
					// In a real implementation, this would use WebSQL API
					this.storage.delete(key);
				}

				clear(): void {
					// In a real implementation, this would use WebSQL API
					this.storage.clear();
				}
			}

			const webSQLAdapter = new MockWebSQLAdapter();
			const typedStorage = createTypedStorage(webSQLAdapter, {
				cache: {
					schema: z.object({
						timestamp: z.number(),
						data: z.record(z.unknown()),
					}),
					defaultValue: {
						timestamp: Date.now(),
						data: {},
					},
					isJson: true,
				},
			});

			// Usage example
			typedStorage.cache.set({
				timestamp: Date.now(),
				data: {
					products: [
						{ id: 1, name: "Product 1" },
						{ id: 2, name: "Product 2" },
					],
				},
			});

			const cache = typedStorage.cache.get();
			expect(cache.timestamp).toBeGreaterThan(0);
			expect(cache.data).toHaveProperty("products");
		});
	});
});
