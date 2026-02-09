module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  moduleNameMapper: {
    "^uuid$": "<rootDir>/src/__mocks__/uuid.js",
    "^../services/email.service$": "<rootDir>/src/__mocks__/email.service.ts"
  },
  transform: {
    "^.+\\.ts$": "ts-jest"  
  }
};
