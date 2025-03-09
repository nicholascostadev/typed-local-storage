import { beforeEach, describe, expect, it } from "vitest";
import { MemoryStorageAdapter } from "../../adapters/memoryStorage.js";

describe("MemoryStorageAdapter", () => {
	let adapter: MemoryStorageAdapter;

	beforeEach(() => {
		adapter = new MemoryStorageAdapter();
	});

	it("should set and get an item", () => {
		adapter.setItem("key", "value");
		expect(adapter.getItem("key")).toBe("value");
	});

	it("should remove an item", () => {
		adapter.setItem("key", "value");
		adapter.removeItem("key");
		expect(adapter.getItem("key")).toBeNull();
	});

	it("should clear all items", () => {
		adapter.setItem("key1", "value1");
		adapter.setItem("key2", "value2");
		adapter.clear();
		expect(adapter.getItem("key1")).toBeNull();
		expect(adapter.getItem("key2")).toBeNull();
	});

	it("should return null for non-existent keys", () => {
		expect(adapter.getItem("non-existent")).toBeNull();
	});
});
