export const logger = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	warn: (...args: any[]) => {
		if (
			process.env.NODE_ENV === "development" &&
			typeof console !== "undefined" &&
			console.warn
		) {
			console.warn(...args);
		}
	},

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	error: (...args: any[]) => {
		if (
			process.env.NODE_ENV === "development" &&
			typeof console !== "undefined" &&
			console.error
		) {
			console.error(...args);
		}
	},
};
