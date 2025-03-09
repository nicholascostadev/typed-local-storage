import type { z } from "zod";
import type { StorageAdapter } from "./types.js";
import { logger } from "./utils.js";

/**
 * Type for storage configuration options
 */
type StorageItemConfig<T extends z.ZodTypeAny> = {
	key?: string;
	schema: T;
	defaultValue: z.infer<T>;
	isJson?: boolean;
};

/**
 * Type for the storage configuration object
 */
type StorageConfig = {
	[key: string]: StorageItemConfig<z.ZodTypeAny>;
};

/**
 * Type helper to determine if a storage adapter is async
 */
type IsAsyncAdapter<T extends StorageAdapter> = ReturnType<
	T["getItem"]
> extends Promise<unknown>
	? true
	: false;

/**
 * Type for the return value of createTypedStorage
 * If the adapter is async, the methods will return Promises
 * If the adapter is sync, the methods will return values directly
 */
type TypedStorageReturn<
	TConfig extends StorageConfig,
	TAdapter extends StorageAdapter,
> = {
	[K in keyof TConfig]: {
		get: IsAsyncAdapter<TAdapter> extends true
			? (options?: { defaultValue?: z.infer<TConfig[K]["schema"]> }) => Promise<
					z.infer<TConfig[K]["schema"]>
				>
			: (options?: { defaultValue?: z.infer<TConfig[K]["schema"]> }) => z.infer<
					TConfig[K]["schema"]
				>;
		set: IsAsyncAdapter<TAdapter> extends true
			? (value: z.infer<TConfig[K]["schema"]>) => Promise<void>
			: (value: z.infer<TConfig[K]["schema"]>) => void;
		remove: IsAsyncAdapter<TAdapter> extends true
			? () => Promise<void>
			: () => void;
	};
};

/**
 * Creates a typed storage object with getters and setters for each key
 * @param adapter - The storage adapter to use
 * @param config - Configuration object with keys and their schemas
 * @returns An object with get, set, and remove methods for each key
 */
export const createTypedStorage = <
	TConfig extends StorageConfig,
	TAdapter extends StorageAdapter,
>(
	adapter: TAdapter,
	config: TConfig,
): TypedStorageReturn<TConfig, TAdapter> => {
	// Create an empty object to hold our storage methods
	const storage = {} as TypedStorageReturn<TConfig, TAdapter>;

	// For each key in the config, create get, set, and remove methods
	for (const [storageKey, itemConfig] of Object.entries(config)) {
		const {
			key = storageKey,
			schema,
			defaultValue,
			isJson = false,
		} = itemConfig;

		// Define the getter function
		const get = (options?: { defaultValue?: z.infer<typeof schema> }) => {
			const finalDefaultValue = options?.defaultValue ?? defaultValue;

			try {
				const item = adapter.getItem(key);

				// Handle async storage adapters
				if (item instanceof Promise) {
					return item
						.then((value) => {
							if (!value) {
								return finalDefaultValue;
							}

							if (isJson) {
								try {
									const parsedItem = schema.safeParse(JSON.parse(value));
									return parsedItem.success
										? parsedItem.data
										: finalDefaultValue;
								} catch {
									return finalDefaultValue;
								}
							}

							const parsedItem = schema.safeParse(value);
							return parsedItem.success ? parsedItem.data : finalDefaultValue;
						})
						.catch((error) => {
							logger.error("Error getting storage item:", error);
							return finalDefaultValue;
						}) as ReturnType<
						TypedStorageReturn<TConfig, TAdapter>[typeof storageKey]["get"]
					>;
				}

				// Handle synchronous storage adapters
				if (!item) {
					return finalDefaultValue;
				}

				if (isJson) {
					try {
						const parsedItem = schema.safeParse(JSON.parse(item));
						return parsedItem.success ? parsedItem.data : finalDefaultValue;
					} catch {
						return finalDefaultValue;
					}
				}

				const parsedItem = schema.safeParse(item);
				return parsedItem.success ? parsedItem.data : finalDefaultValue;
			} catch (error) {
				logger.error("Error getting storage item:", error);
				return finalDefaultValue;
			}
		};

		// Define the setter function
		const set = (value: z.infer<typeof schema>) => {
			try {
				const parsedValue = schema.safeParse(value);

				if (!parsedValue.success) {
					logger.warn("Invalid value for key:", key, "Value:", value);
					return;
				}

				const stringValue = isJson
					? JSON.stringify(parsedValue.data)
					: String(parsedValue.data);

				const result = adapter.setItem(key, stringValue);

				// Return the promise if the adapter is async
				return result;
			} catch (error) {
				logger.error("Error setting storage item:", error);
			}
		};

		// Define the remove function
		const remove = () => {
			try {
				return adapter.removeItem(key);
			} catch (error) {
				logger.error("Error removing storage item:", error);
			}
		};

		// Add the methods to the storage object
		storage[storageKey as keyof TConfig] = {
			get,
			set,
			remove,
		} as TypedStorageReturn<TConfig, TAdapter>[keyof TConfig];
	}

	return storage;
};
