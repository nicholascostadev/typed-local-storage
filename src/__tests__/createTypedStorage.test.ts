import { beforeEach, describe, expect, it, vi } from "vitest";
import { AsyncStorageAdapter } from "../adapters/asyncStorage.js";
import { MemoryStorageAdapter } from "../adapters/memoryStorage.js";
import { createTypedStorage } from "../createTypedStorage.js";
import {
	createAsyncStorageMock,
	createLocalStorageMock,
	objectSchema,
	stringSchema,
} from "./utils.js";

describe("createTypedStorage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("with synchronous adapter", () => {
		it("should create a typed storage with synchronous methods", () => {
			const memoryAdapter = new MemoryStorageAdapter();

			const typedStorage = createTypedStorage(memoryAdapter, {
				user: {
					key: "user",
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
				token: {
					schema: stringSchema,
					defaultValue: "",
				},
			});

			// Check that the storage has the expected keys
			expect(typedStorage).toHaveProperty("user");
			expect(typedStorage).toHaveProperty("token");

			// Check that each key has get, set, and remove methods
			expect(typedStorage.user).toHaveProperty("get");
			expect(typedStorage.user).toHaveProperty("set");
			expect(typedStorage.user).toHaveProperty("remove");
			expect(typedStorage.token).toHaveProperty("get");
			expect(typedStorage.token).toHaveProperty("set");
			expect(typedStorage.token).toHaveProperty("remove");

			// Check that the methods are synchronous (not promises)
			const userValue = typedStorage.user.get();
			expect(userValue).toEqual({ name: "", age: 0 });
			expect(userValue).not.toBeInstanceOf(Promise);

			const tokenValue = typedStorage.token.get();
			expect(tokenValue).toBe("");
			expect(tokenValue).not.toBeInstanceOf(Promise);
		});

		it("should store and retrieve values correctly with explicit key", () => {
			const memoryAdapter = new MemoryStorageAdapter();

			const typedStorage = createTypedStorage(memoryAdapter, {
				user: {
					key: "user-data", // Explicit key different from property name
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Set a value
			typedStorage.user.set({ name: "John", age: 30 });

			// Get the value
			const userValue = typedStorage.user.get();
			expect(userValue).toEqual({ name: "John", age: 30 });

			// Check that the value is stored in the adapter with the explicit key
			const storedValue = memoryAdapter.getItem("user-data");
			expect(storedValue).toBe('{"name":"John","age":30}');

			// Verify that it's not stored with the property name
			const notStoredValue = memoryAdapter.getItem("user");
			expect(notStoredValue).toBeNull();
		});

		it("should store and retrieve values correctly with implicit key", () => {
			const memoryAdapter = new MemoryStorageAdapter();

			const typedStorage = createTypedStorage(memoryAdapter, {
				user: {
					// No explicit key, should use "user" as the key
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Set a value
			typedStorage.user.set({ name: "John", age: 30 });

			// Get the value
			const userValue = typedStorage.user.get();
			expect(userValue).toEqual({ name: "John", age: 30 });

			// Check that the value is stored in the adapter with the property name as key
			const storedValue = memoryAdapter.getItem("user");
			expect(storedValue).toBe('{"name":"John","age":30}');
		});

		it("should handle invalid values", () => {
			const memoryAdapter = new MemoryStorageAdapter();

			const typedStorage = createTypedStorage(memoryAdapter, {
				user: {
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Set an invalid value
			// @ts-expect-error Testing invalid value
			typedStorage.user.set({ name: 123, age: "invalid" });

			// Check that the value was not stored
			const storedValue = memoryAdapter.getItem("user");
			expect(storedValue).toBeNull();

			// Get should return the default value
			const userValue = typedStorage.user.get();
			expect(userValue).toEqual({ name: "", age: 0 });
		});

		it("should handle custom default values", () => {
			const memoryAdapter = new MemoryStorageAdapter();

			const typedStorage = createTypedStorage(memoryAdapter, {
				user: {
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Get with custom default value
			const userValue = typedStorage.user.get({
				defaultValue: { name: "Custom", age: 99 },
			});

			expect(userValue).toEqual({ name: "Custom", age: 99 });
		});

		it("should remove values correctly with explicit key", () => {
			const memoryAdapter = new MemoryStorageAdapter();

			const typedStorage = createTypedStorage(memoryAdapter, {
				user: {
					key: "user-data",
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Set a value
			typedStorage.user.set({ name: "John", age: 30 });

			// Verify it was stored
			expect(memoryAdapter.getItem("user-data")).not.toBeNull();

			// Remove the value
			typedStorage.user.remove();

			// Check that the value was removed
			const storedValue = memoryAdapter.getItem("user-data");
			expect(storedValue).toBeNull();

			// Get should return the default value
			const userValue = typedStorage.user.get();
			expect(userValue).toEqual({ name: "", age: 0 });
		});

		it("should remove values correctly with implicit key", () => {
			const memoryAdapter = new MemoryStorageAdapter();

			const typedStorage = createTypedStorage(memoryAdapter, {
				user: {
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Set a value
			typedStorage.user.set({ name: "John", age: 30 });

			// Verify it was stored
			expect(memoryAdapter.getItem("user")).not.toBeNull();

			// Remove the value
			typedStorage.user.remove();

			// Check that the value was removed
			const storedValue = memoryAdapter.getItem("user");
			expect(storedValue).toBeNull();

			// Get should return the default value
			const userValue = typedStorage.user.get();
			expect(userValue).toEqual({ name: "", age: 0 });
		});
	});

	describe("with asynchronous adapter", () => {
		it("should create a typed storage with asynchronous methods", async () => {
			const localStorageMock = createLocalStorageMock();
			const asyncStorageMock = createAsyncStorageMock(localStorageMock);
			const asyncAdapter = new AsyncStorageAdapter(asyncStorageMock);

			const typedStorage = createTypedStorage(asyncAdapter, {
				user: {
					key: "user",
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
				token: {
					// No explicit key
					schema: stringSchema,
					defaultValue: "",
				},
			});

			// Check that the methods return promises
			const userPromise = typedStorage.user.get();
			expect(userPromise).toBeInstanceOf(Promise);

			const tokenPromise = typedStorage.token.get();
			expect(tokenPromise).toBeInstanceOf(Promise);

			// Await the promises
			const userValue = await userPromise;
			const tokenValue = await tokenPromise;

			expect(userValue).toEqual({ name: "", age: 0 });
			expect(tokenValue).toBe("");
		});

		it("should store and retrieve values correctly with explicit key", async () => {
			const localStorageMock = createLocalStorageMock();
			const asyncStorageMock = createAsyncStorageMock(localStorageMock);
			const asyncAdapter = new AsyncStorageAdapter(asyncStorageMock);

			const typedStorage = createTypedStorage(asyncAdapter, {
				user: {
					key: "user-data", // Explicit key different from property name
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Set a value
			await typedStorage.user.set({ name: "John", age: 30 });

			// Get the value
			const userValue = await typedStorage.user.get();
			expect(userValue).toEqual({ name: "John", age: 30 });

			// Check that the value is stored in the adapter with the explicit key
			expect(asyncStorageMock.setItem).toHaveBeenCalledWith(
				"user-data",
				'{"name":"John","age":30}',
			);
		});

		it("should store and retrieve values correctly with implicit key", async () => {
			const localStorageMock = createLocalStorageMock();
			const asyncStorageMock = createAsyncStorageMock(localStorageMock);
			const asyncAdapter = new AsyncStorageAdapter(asyncStorageMock);

			const typedStorage = createTypedStorage(asyncAdapter, {
				user: {
					// No explicit key, should use "user" as the key
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Set a value
			await typedStorage.user.set({ name: "John", age: 30 });

			// Get the value
			const userValue = await typedStorage.user.get();
			expect(userValue).toEqual({ name: "John", age: 30 });

			// Check that the value is stored in the adapter with the property name as key
			expect(asyncStorageMock.setItem).toHaveBeenCalledWith(
				"user",
				'{"name":"John","age":30}',
			);
		});

		it("should handle invalid values", async () => {
			const localStorageMock = createLocalStorageMock();
			const asyncStorageMock = createAsyncStorageMock(localStorageMock);
			const asyncAdapter = new AsyncStorageAdapter(asyncStorageMock);

			const typedStorage = createTypedStorage(asyncAdapter, {
				user: {
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Set an invalid value
			// @ts-expect-error Testing invalid value
			await typedStorage.user.set({ name: 123, age: "invalid" });

			// Check that the value was not stored
			expect(asyncStorageMock.setItem).not.toHaveBeenCalled();

			// Get should return the default value
			const userValue = await typedStorage.user.get();
			expect(userValue).toEqual({ name: "", age: 0 });
		});

		it("should remove values correctly with explicit key", async () => {
			const localStorageMock = createLocalStorageMock();
			const asyncStorageMock = createAsyncStorageMock(localStorageMock);
			const asyncAdapter = new AsyncStorageAdapter(asyncStorageMock);

			const typedStorage = createTypedStorage(asyncAdapter, {
				user: {
					key: "user-data",
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Set a value
			await typedStorage.user.set({ name: "John", age: 30 });

			// Remove the value
			await typedStorage.user.remove();

			// Check that the value was removed with the explicit key
			expect(asyncStorageMock.removeItem).toHaveBeenCalledWith("user-data");
		});

		it("should remove values correctly with implicit key", async () => {
			const localStorageMock = createLocalStorageMock();
			const asyncStorageMock = createAsyncStorageMock(localStorageMock);
			const asyncAdapter = new AsyncStorageAdapter(asyncStorageMock);

			const typedStorage = createTypedStorage(asyncAdapter, {
				user: {
					// No explicit key
					schema: objectSchema,
					defaultValue: { name: "", age: 0 },
					isJson: true,
				},
			});

			// Set a value
			await typedStorage.user.set({ name: "John", age: 30 });

			// Remove the value
			await typedStorage.user.remove();

			// Check that the value was removed with the property name as key
			expect(asyncStorageMock.removeItem).toHaveBeenCalledWith("user");
		});
	});
});
