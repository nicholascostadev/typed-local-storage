import { beforeEach, describe, expect, it, vi } from "vitest";
import { AsyncStorageAdapter } from "../../adapters/asyncStorage.js";
import { createAsyncStorageMock, createLocalStorageMock } from "../utils.js";

describe("AsyncStorageAdapter", () => {
	const localStorageMock = createLocalStorageMock();
	const asyncStorageMock = createAsyncStorageMock(localStorageMock);
	let adapter: AsyncStorageAdapter;

	beforeEach(() => {
		localStorageMock.clear();
		vi.clearAllMocks();
		adapter = new AsyncStorageAdapter(asyncStorageMock);
	});

	it("should set and get an item", async () => {
		await adapter.setItem("key", "value");
		expect(await adapter.getItem("key")).toBe("value");
		expect(asyncStorageMock.setItem).toHaveBeenCalledWith("key", "value");
		expect(asyncStorageMock.getItem).toHaveBeenCalledWith("key");
	});

	it("should remove an item", async () => {
		await adapter.setItem("key", "value");
		await adapter.removeItem("key");
		expect(await adapter.getItem("key")).toBeNull();
		expect(asyncStorageMock.removeItem).toHaveBeenCalledWith("key");
	});

	it("should clear all items", async () => {
		await adapter.setItem("key1", "value1");
		await adapter.setItem("key2", "value2");
		await adapter.clear();
		expect(await adapter.getItem("key1")).toBeNull();
		expect(await adapter.getItem("key2")).toBeNull();
		expect(asyncStorageMock.clear).toHaveBeenCalled();
	});

	it("should properly delegate to the underlying AsyncStorage", async () => {
		// Test that all methods properly delegate to the underlying AsyncStorage
		await adapter.getItem("test-key");
		expect(asyncStorageMock.getItem).toHaveBeenCalledWith("test-key");

		await adapter.setItem("test-key", "test-value");
		expect(asyncStorageMock.setItem).toHaveBeenCalledWith(
			"test-key",
			"test-value",
		);

		await adapter.removeItem("test-key");
		expect(asyncStorageMock.removeItem).toHaveBeenCalledWith("test-key");

		await adapter.clear();
		expect(asyncStorageMock.clear).toHaveBeenCalled();
	});
});
