import { beforeEach, describe, expect, it } from "vitest";
import { LocalStorageAdapter } from "../../adapters/localStorage.js";
import { createLocalStorageMock } from "../utils.js";

describe("LocalStorageAdapter", () => {
	const localStorageMock = createLocalStorageMock();

	// Mock global localStorage
	beforeEach(() => {
		global.localStorage = localStorageMock as Storage;
		localStorageMock.clear();
	});

	it("should set and get an item", () => {
		const adapter = new LocalStorageAdapter();
		adapter.setItem("key", "value");
		expect(adapter.getItem("key")).toBe("value");
	});

	it("should remove an item", () => {
		const adapter = new LocalStorageAdapter();
		adapter.setItem("key", "value");
		adapter.removeItem("key");
		expect(adapter.getItem("key")).toBeNull();
	});

	it("should clear all items", () => {
		const adapter = new LocalStorageAdapter();
		adapter.setItem("key1", "value1");
		adapter.setItem("key2", "value2");
		adapter.clear();
		expect(adapter.getItem("key1")).toBeNull();
		expect(adapter.getItem("key2")).toBeNull();
	});
});
