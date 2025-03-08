import type { z } from "zod";
import { logger } from "./utils.js";

export type GetLocalStorageItemOptions<T extends z.ZodTypeAny> = {
	schema: T;
	defaultValue: z.infer<T>;
	isJson?: boolean;
};

/**
 * Gets an item from localStorage with type validation using Zod
 * @param key - The localStorage key to retrieve
 * @param options - Configuration options
 * @param options.schema - Zod schema to validate the stored value
 * @param options.defaultValue - Default value if item doesn't exist or is invalid
 * @param options.isJson - Whether the stored value is JSON and needs parsing
 * @returns The validated value from localStorage or the default value
 */
export const getLocalStorageItem = <T extends z.ZodTypeAny>(
	key: string,
	{ schema, defaultValue, isJson = false }: GetLocalStorageItemOptions<T>,
): z.infer<T> => {
	try {
		const item = localStorage.getItem(key);

		if (!item) {
			return defaultValue;
		}

		if (isJson) {
			const parsedItem = schema.safeParse(JSON.parse(item));

			if (!parsedItem.success) {
				return defaultValue;
			}

			return parsedItem.data;
		}

		const parsedItem = schema.safeParse(item);

		if (!parsedItem.success) {
			return defaultValue;
		}

		return parsedItem.data;
	} catch (error) {
		logger.error("Error getting local storage item:", error);
		localStorage.setItem(
			key,
			isJson ? JSON.stringify(defaultValue) : defaultValue,
		);
		return defaultValue;
	}
};

export type DefineGetterAndSetterOptions<T extends z.ZodTypeAny> = {
	key: string;
	schema: T;
	defaultValue: z.infer<T>;
	isJson?: boolean;
};

export type DefineGetterAndSetterReturn<T extends z.ZodTypeAny> = {
	get: (options?: { defaultValue: z.infer<T> }) => z.infer<T>;
	set: (value: z.infer<T>) => void;
};

/**
 * Creates a typed getter and setter for localStorage values
 * @param options - Configuration options
 * @param options.key - The localStorage key
 * @param options.schema - Zod schema for type validation
 * @param options.defaultValue - Default value if item doesn't exist or is invalid
 * @param options.isJson - Whether the value should be stored as JSON
 * @returns Object with get and set methods for the localStorage value
 */
export const defineGetterAndSetter = <T extends z.ZodTypeAny>({
	key,
	schema,
	defaultValue,
	isJson = false,
}: DefineGetterAndSetterOptions<T>): DefineGetterAndSetterReturn<T> => {
	return {
		get: (options) =>
			getLocalStorageItem(key, { schema, defaultValue, ...options }),
		set: (value) => {
			const parsedValue = schema.safeParse(value);

			if (!parsedValue.success) {
				logger.warn("Invalid value for key:", key, "Value:", value);
				return;
			}

			localStorage.setItem(
				key,
				isJson ? JSON.stringify(parsedValue.data) : parsedValue.data,
			);
		},
	};
};
