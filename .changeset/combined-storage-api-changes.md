---
"@nicholascostadev/typed-local-storage": major
---

# Major Update: New API with Storage Adapters

This release introduces a completely new API for typed-local-storage, focusing on a more intuitive and type-safe approach with `createTypedStorage` and support for multiple storage backends.

## What's Changed

### New Storage Adapter System
- Created a storage adapter interface for pluggable storage backends
- Added adapters for localStorage, AsyncStorage (React Native), and in-memory storage
- Support for both synchronous and asynchronous storage operations
- Automatic return type inference based on the adapter used (sync or async)

### New API with createTypedStorage
- Removed all previous APIs (`getStorageItem`, `defineGetterAndSetter`, `getLocalStorageItem`)
- Introduced new `createTypedStorage` function that creates a single source of storage with typed keys
- Simplified configuration by passing the storage adapter directly to `createTypedStorage`
- Made the `key` property optional in storage configuration (falls back to the object key if not provided)
- Added `remove` method to storage objects

## Migration Guide

### Before:

```typescript
import { defineGetterAndSetter } from '@nicholascostadev/typed-local-storage';

const userStorage = defineGetterAndSetter({
  key: 'user',
  schema: z.object({
    name: z.string(),
    age: z.number(),
  }),
  defaultValue: { name: '', age: 0 },
  isJson: true,
});

// Usage
const user = await userStorage.get();
await userStorage.set({ name: 'John', age: 30 });
```

### After:

```typescript
import { createTypedStorage, LocalStorageAdapter } from '@nicholascostadev/typed-local-storage';

const typedStorage = createTypedStorage(new LocalStorageAdapter(), {
  user: {
    // key is optional, will use "user" if not provided
    schema: z.object({
      name: z.string(),
      age: z.number(),
    }),
    defaultValue: { name: '', age: 0 },
    isJson: true,
  },
  theme: {
    schema: z.enum(['light', 'dark']),
    defaultValue: 'light',
  }
});

// Usage
const user = await typedStorage.user.get();
await typedStorage.user.set({ name: 'John', age: 30 });
await typedStorage.user.remove(); // New remove method

// Using with other storage adapters
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageAdapter, MemoryStorageAdapter } from '@nicholascostadev/typed-local-storage';

// For React Native
const asyncTypedStorage = createTypedStorage(new AsyncStorageAdapter(AsyncStorage), {...});

// For testing
const memoryTypedStorage = createTypedStorage(new MemoryStorageAdapter(), {...});
```

## Benefits of the New API

- Support for multiple storage backends (localStorage, AsyncStorage, in-memory, custom)
- Single source of truth for all storage keys
- Better type inference and type safety
- More intuitive API with less boilerplate
- Automatic key inference from object keys
- Synchronous or asynchronous return types based on the adapter used 