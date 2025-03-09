# Typed Storage

[![CI](https://github.com/nicholascostadev/typed-local-storage/actions/workflows/main.yml/badge.svg)](https://github.com/nicholascostadev/typed-local-storage/actions/workflows/main.yml)
[![Tests](https://github.com/nicholascostadev/typed-local-storage/actions/workflows/test.yml/badge.svg)](https://github.com/nicholascostadev/typed-local-storage/actions/workflows/test.yml)

> ⚠️ **Warning**: This library is still in early development (pre-1.0.0). The API may change between minor versions. Please pay attention to updates and changelogs when upgrading.

This package provides type-safe storage utilities with Zod schema validation. It supports multiple storage backends including browser's localStorage, React Native's AsyncStorage, and an in-memory storage for testing.

## Installation

```bash
npm install @nicholascostadev/typed-local-storage
# or
pnpm add @nicholascostadev/typed-local-storage
# or
yarn add @nicholascostadev/typed-local-storage
```

## Usage

### Basic Example with localStorage (default)

```typescript
import { z } from 'zod';
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
  },
});

// Get user data
const userData = await typedStorage.user.get();
//   ^? { name: string; age: number }

// Set user data
await typedStorage.user.set({ name: 'Jane', age: 25 });
//              ^? param typed as { name: string; age: number }

// Remove user data
await typedStorage.user.remove();

// Get theme
const theme = await typedStorage.theme.get();
//   ^? 'light' | 'dark'

// Set theme
await typedStorage.theme.set('dark');
//              ^? param typed as 'dark' | 'light'
```

### Using with React Native's AsyncStorage

First, install AsyncStorage:

```bash
npm install @react-native-async-storage/async-storage
# or
yarn add @react-native-async-storage/async-storage
```

Then use it with the AsyncStorageAdapter:

```typescript
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  createTypedStorage, 
  AsyncStorageAdapter 
} from '@nicholascostadev/typed-local-storage';

// Create a typed storage with AsyncStorage
const typedStorage = createTypedStorage(new AsyncStorageAdapter(AsyncStorage), {
  user: {
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
  },
});

// Usage is the same as before, but uses AsyncStorage under the hood
const userData = await typedStorage.user.get();
await typedStorage.user.set({ name: 'Jane', age: 25 });
```

### Using with in-memory storage for testing

```typescript
import { z } from 'zod';
import { 
  createTypedStorage, 
  MemoryStorageAdapter 
} from '@nicholascostadev/typed-local-storage';

// Create an in-memory storage adapter
const memoryAdapter = new MemoryStorageAdapter();

// Create a typed storage with in-memory storage
const typedStorage = createTypedStorage(memoryAdapter, {
  user: {
    schema: z.object({
      name: z.string(),
      age: z.number(),
    }),
    defaultValue: { name: '', age: 0 },
    isJson: true,
  },
});

// Usage is synchronous with MemoryStorageAdapter
const userData = typedStorage.user.get();
typedStorage.user.set({ name: 'Jane', age: 25 });
```

### Using custom keys

You can specify a custom key for storage that's different from the object property:

```typescript
import { z } from 'zod';
import { createTypedStorage, MemoryStorageAdapter } from '@nicholascostadev/typed-local-storage';

const typedStorage = createTypedStorage(new MemoryStorageAdapter(), {
  user: {
    key: 'app:user:data', // Custom storage key
    schema: z.object({
      name: z.string(),
      age: z.number(),
    }),
    defaultValue: { name: '', age: 0 },
    isJson: true,
  },
});

// The data will be stored with the key 'app:user:data'
typedStorage.user.set({ name: 'Jane', age: 25 });
```

### Custom default values for get operations

You can provide a custom default value when getting data:

```typescript
const userData = await typedStorage.user.get({ 
  defaultValue: { name: 'Guest', age: 0 } 
});
```

## API Reference

### Storage Adapters

The library provides several storage adapters:

- `LocalStorageAdapter`: Uses browser's localStorage
- `MemoryStorageAdapter`: In-memory storage for testing or environments without localStorage
- `AsyncStorageAdapter`: Adapter for React Native's AsyncStorage

### Creating Custom Storage Adapters

You can create your own storage adapter by implementing the `StorageAdapter` interface:

```typescript
import { StorageAdapter } from '@nicholascostadev/typed-local-storage';

class CustomStorageAdapter implements StorageAdapter {
  // Synchronous implementation example
  getItem(key: string): string | null {
    // Your implementation here
    return yourCustomStorage.get(key);
  }

  setItem(key: string, value: string): void {
    // Your implementation here
    yourCustomStorage.set(key, value);
  }

  removeItem(key: string): void {
    // Your implementation here
    yourCustomStorage.delete(key);
  }

  clear(): void {
    // Your implementation here
    yourCustomStorage.clear();
  }
}

// Asynchronous implementation example
class CustomAsyncStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    // Your implementation here
    return await yourAsyncStorage.get(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    // Your implementation here
    await yourAsyncStorage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    // Your implementation here
    await yourAsyncStorage.delete(key);
  }

  async clear(): Promise<void> {
    // Your implementation here
    await yourAsyncStorage.clear();
  }
}

// Usage with your custom adapter
const typedStorage = createTypedStorage(new CustomStorageAdapter(), {
  // Your storage configuration
});
```

The return type of your adapter's methods determines whether the storage operations will be synchronous or asynchronous:

- If `getItem` returns `string | null`, operations will be synchronous
- If `getItem` returns `Promise<string | null>`, operations will be asynchronous (wrapped in Promises)

#### Example Implementations

For complete working examples of custom storage adapters, check out the test files in the repository:

- [`src/__tests__/adapters/customAdapter.test.ts`](https://github.com/nicholascostadev/typed-local-storage/blob/main/src/__tests__/adapters/customAdapter.test.ts) - Contains examples of:
  - Synchronous custom adapter using a Map
  - Asynchronous custom adapter with simulated network delays
  - Mock IndexedDB adapter implementation
  - Mock WebSQL adapter implementation
- [`src/adapters/memoryStorage.ts`](https://github.com/nicholascostadev/typed-local-storage/blob/main/src/adapters/memoryStorage.ts) - Simple in-memory storage implementation
- [`src/adapters/localStorage.ts`](https://github.com/nicholascostadev/typed-local-storage/blob/main/src/adapters/localStorage.ts) - Browser's localStorage adapter
- [`src/adapters/asyncStorage.ts`](https://github.com/nicholascostadev/typed-local-storage/blob/main/src/adapters/asyncStorage.ts) - React Native's AsyncStorage adapter

These examples demonstrate different approaches to implementing the `StorageAdapter` interface for various storage backends.

### `createTypedStorage(adapter, config)`

Creates a typed storage object with getters and setters for each key.

Parameters:
- `adapter`: The storage adapter to use
- `config`: Configuration object with keys and their schemas

Returns:
- An object with get, set, and remove methods for each key

## Features

- Type-safe storage operations
- Zod schema validation
- Support for multiple storages (localStorage, AsyncStorage, in-memory)
- JSON parsing/stringifying support
- Default value fallback
- Error handling with console logging
- TypeScript support with full type inference
- Automatic return type inference based on adapter (sync or async)
- Optional key property (falls back to object key if not provided)

## Error Handling

The package includes built-in error handling:
- Returns default value if storage item doesn't exist
- Returns default value if parsing fails
- Returns default value if schema validation fails
- Logs errors to console for debugging in development mode
- Automatically sets default value when errors occur

## Contributing

Contributions are welcome! Please submit a pull request or create an issue for any features, bug fixes, or improvements.

## Prerequisites

- Node.js v22.5.1 (ensure you have this version by using `.nvmrc`)
- `pnpm` (Follow [pnpm installation guide](https://pnpm.io/installation) if you haven't installed it)
- [Biome](https://biomejs.dev/) for linting and formatting

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/nicholascostadev/typed-local-storage.git
```

2. Install dependencies:
```bash
pnpm install
```

3. Available Scripts:
```bash
pnpm run dev    # Start development mode with watch
pnpm run build  # Build the package
pnpm run check  # Run Biome linting
pnpm run test   # Run tests with Vitest
pnpm run test:coverage # Run tests with coverage report
```

## Continuous Integration

This project uses GitHub Actions for continuous integration:

- **CI Workflow**: Runs on every push and pull request to verify linting, build, and tests.
- **Test Workflow**: Runs tests across multiple Node.js versions (18.x, 20.x, 22.x) and generates coverage reports.
- **Publish Workflow**: Handles publishing to npm when changes are merged to the main branch.

## License

This project is open-sourced under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Author

Nicholas Costa (nicholascostadev)
