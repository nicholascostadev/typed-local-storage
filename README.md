# This package used the TS NPM Package Boilerplate (2025)

This TypeScript NPM package boilerplate is designed to kickstart the development of TypeScript libraries for Node.js and the browser. It features a modern build setup with TypeScript, leveraging `tsup` for bundling and `@changesets/cli` for version management.

## Prerequisites

- Node.js v22.5.1 (ensure you have this version by using `.nvmrc`)
- `pnpm` (Follow [pnpm installation guide](https://pnpm.io/installation) if you haven't installed it)
- [Biome](https://biomejs.dev/) for linting and formatting

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-package-name.git
cd your-package-name
```

2. Install dependencies:
```bash
pnpm install
```

3. Available Scripts:
```bash
pnpm run dev    # Start development mode with watch
pnpm run build  # Build the package
pnpm run lint   # Run Biome linting
pnpm run format # Format code with Biome
```

## Package Documentation

This package provides type-safe localStorage utilities with Zod schema validation. It includes two main functions: `getLocalStorageItem` and `defineGetterAndSetter`.

### Installation

```bash
npm install your-package-name
# or
pnpm add your-package-name
# or
yarn add your-package-name
```

### Usage

#### Basic Example

```typescript
import { z } from 'zod';
import { defineGetterAndSetter } from 'your-package-name';

// Define a schema for your data
const userSchema = z.object({
  name: z.string(),
  age: z.number(),
});

// Using defineGetterAndSetter
const userStorage = defineGetterAndSetter({
  key: 'user',
  schema: userSchema,
  defaultValue: { name: 'John', age: 30 },
  isJson: true,
});

const themeStorage = defineGetterAndSetter({
  key: 'theme',
  schema: z.enum(['light', 'dark']),
  defaultValue: 'light',
});

// Get user data
const userData = userStorage.get();

// Set user data
userStorage.set({ name: 'Jane', age: 25 });

// Get theme
const theme = themeStorage.get();

// Set theme
themeStorage.set('dark');

```

You can also create a single source of data by creating a single typedLocalStorage object(my preferred way), e.g:

```typescript

const typedLocalStorage = {
  user: defineGetterAndSetter({
    key: 'user',
    schema: userSchema,
    defaultValue: { name: 'John', age: 30 },
    isJson: true,
  }),
  theme: defineGetterAndSetter({
    key: 'theme',
    schema: z.enum(['light', 'dark']),
    defaultValue: 'light',
  }),
};

// Get user data
const userData = typedLocalStorage.user.get();

// Set user data
typedLocalStorage.user.set({ name: 'Jane', age: 25 });

// Get theme
const theme = typedLocalStorage.theme.get();
```

You can also set a default value by `get` method in case you want to change the default value for this specific operation, e.g:

```typescript
const userData = typedLocalStorage.user.get({ defaultValue: { name: 'John', age: 30 } });
```

### API Reference

#### `getLocalStorageItem`

It's only used internally, but you can use it too if you'd like. It essentially get's the item from localStorage and validates it with the provided Zod schema.

Parameters:
- `key`: The localStorage key to retrieve
- `options.schema`: Zod schema for type validation
- `options.defaultValue`: Default value if item doesn't exist or is invalid
- `options.isJson`: Whether the stored value is JSON (default: false)

#### `defineGetterAndSetter`

Creates typed getter and setter functions for localStorage values.

Parameters:
- `options.key`: The localStorage key
- `options.schema`: Zod schema for type validation
- `options.defaultValue`: Default value if item doesn't exist or is invalid
- `options.isJson`: Whether the value should be stored as JSON (default: false)

Returns:
- An object with `get` and `set` methods for managing the localStorage value

### Features

- Type-safe localStorage operations
- Zod schema validation
- JSON parsing/stringifying support
- Default value fallback
- Error handling with console logging
- TypeScript support with full type inference

### Error Handling

The package includes built-in error handling:
- Returns default value if localStorage item doesn't exist
- Returns default value if parsing fails
- Returns default value if schema validation fails
- Logs errors to console for debugging in development mode
- Automatically sets default value when errors occur

## Contributing

Contributions are welcome! Please submit a pull request or create an issue for any features, bug fixes, or improvements.

## License

This project is open-sourced under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Author

Simon Orzel
