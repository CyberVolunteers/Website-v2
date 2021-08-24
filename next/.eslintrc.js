module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"next",
		"next/core-web-vitals",
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["react", "@typescript-eslint"],
	rules: {
		"react/react-in-jsx-scope": "off",
		"no-console": "error",
		"no-unsafe-optional-chaining": "warn",
		"require-atomic-updates": "warn",
		eqeqeq: "warn",
		strict: ["warn", "global"],
		// indent: ["warn", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
};
