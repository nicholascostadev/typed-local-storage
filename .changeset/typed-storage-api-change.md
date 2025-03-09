---
"@nicholascostadev/typed-local-storage": major
---

# Breaking Changes: New API with createTypedStorage

This release introduces a completely new API for typed-local-storage, focusing on a more intuitive and type-safe approach with `createTypedStorage`.

## What's Changed

- Removed all previous APIs (`getStorageItem`, `defineGetterAndSetter`, `getLocalStorageItem`)
- Introduced new `createTypedStorage` function that creates a single source of storage with typed keys
- Simplified configuration by passing the storage adapter directly to `createTypedStorage`
- Made the `key` property optional in storage configuration (falls back to the object key if not provided)

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
import { createTypedStorage, MemoryStorageAdapter } from '@nicholascostadev/typed-local-storage';
//                                      Or use other available adapters
const typedStorage = createTypedStorage(new MemoryStorageAdapter(), {
  user: {
    // key is optional, will use "user" if not provided
    schema: z.object({
      name: z.string(),
      age: z.number(),
    }),
    defaultValue: { name: '', age: 0 },
    isJson: true,
  },
});

// Usage
const user = await typedStorage.user.get();
await typedStorage.user.set({ name: 'John', age: 30 });
```

## Benefits of the New API

- Single source of truth for all storage keys
- Better type inference and type safety
- More intuitive API with less boilerplate
- Automatic key inference from object keys
- Synchronous or asynchronous return types based on the adapter used