module.exports = {
  testEnvironment: "jsdom",

  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.js",
  ],

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  moduleFileExtensions: [
    "js",
    "jsx",
  ],

  testMatch: [
    "**/src/tests/**/*.test.jsx",
  ],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/tests/styleMock.js",
  },

  clearMocks: true,
};