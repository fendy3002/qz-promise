module.exports = {
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testMatch: ["**/*.spec.ts"],
  reporters: ['default'],
};
