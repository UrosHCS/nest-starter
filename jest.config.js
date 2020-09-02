module.exports = {
  verbose: true,
  // Look for spec.ts files in test dir
  testMatch: ['<rootDir>/test/**/*spec.ts'],
  // Since all the tests are in the test folder
  // we don't need jest to go through other folders
  testPathIgnorePatterns: [],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // This tells jest where to look for src modules
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  // We are building a node server
  testEnvironment: 'node',
  // We must compile the ts files
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
}
