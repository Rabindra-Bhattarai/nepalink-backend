module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/__tests__"],
  setupFilesAfterEnv: ["<rootDir>/src/test_utils/setup.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^../services/email.service$": "<rootDir>/src/__mocks__/email.service.ts",
    "^../middlewares/upload.middleware$": "<rootDir>/src/__mocks__/upload.middleware.ts"
  },
  transformIgnorePatterns: ["node_modules/(?!(uuid)/)"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/**/__tests__/**"]
};
