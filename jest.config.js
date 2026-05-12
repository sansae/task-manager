module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  }
};