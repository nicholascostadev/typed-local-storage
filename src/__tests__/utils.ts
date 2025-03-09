import { vi } from "vitest";
import { z } from "zod";

// Export mocked logger functions that can be used in tests
export const loggerMock = {
	warn: vi.fn(),
	error: vi.fn(),
};

// Mock the logger
vi.mock("../utils.js", () => ({
	logger: loggerMock,
}));

// Mock localStorage for browser environment tests
export const createLocalStorageMock = () => {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string): string | null => {
			return store[key] || null;
		},
		setItem: (key: string, value: string): void => {
			store[key] = value;
		},
		removeItem: (key: string): void => {
			delete store[key];
		},
		clear: (): void => {
			store = {};
		},
		length: 0,
		key: (_index: number): string | null => null,
	};
};

// Mock AsyncStorage for React Native environment tests
export const createAsyncStorageMock = (
	localStorageMock: ReturnType<typeof createLocalStorageMock>,
) => {
	return {
		getItem: vi.fn((key: string): Promise<string | null> => {
			return Promise.resolve(localStorageMock.getItem(key));
		}),
		setItem: vi.fn((key: string, value: string): Promise<void> => {
			localStorageMock.setItem(key, value);
			return Promise.resolve();
		}),
		removeItem: vi.fn((key: string): Promise<void> => {
			localStorageMock.removeItem(key);
			return Promise.resolve();
		}),
		clear: vi.fn((): Promise<void> => {
			localStorageMock.clear();
			return Promise.resolve();
		}),
	};
};

// Common test schemas
export const stringSchema = z.string();
export const numberSchema = z.number();
export const objectSchema = z.object({
	name: z.string(),
	age: z.number(),
});

// Common test values
export const testString = "test-value";
export const testNumber = 42;
export const testObject = { name: "John", age: 30 };
