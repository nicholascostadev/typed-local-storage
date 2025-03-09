import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		include: ["**/*.{test,spec}.{ts,tsx}"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"dist/",
				".github/",
				"src/index.ts",
				"src/adapters/index.ts",
				"**/types.ts",
				"vitest.config.ts",
			],
		},
	},
});
