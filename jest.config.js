module.exports = {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
		"^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
		"^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
	},
	collectCoverageFrom: [
		"app/**/*.{ts,tsx}",
		"components/**/*.{ts,tsx}",
		"lib/**/*.{ts,tsx}",
		"!**/*.d.ts",
		"!**/node_modules/**",
		"!**/.next/**",
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 85,
			lines: 85,
			statements: 85,
		},
	},
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	transform: {
		"^.+\\.(ts|tsx)$": [
			"@swc/jest",
			{
				jsc: {
					parser: {
						syntax: "typescript",
						tsx: true,
					},
					transform: {
						react: {
							runtime: "automatic",
						},
					},
				},
			},
		],
	},
	testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};
