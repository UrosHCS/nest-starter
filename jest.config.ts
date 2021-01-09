// export default {
//   verbose: true,
//   // Look for spec.ts files in test dir
//   testMatch: ['<rootDir>/test/**/*spec.ts'],
//   // Since all the tests are in the test folder
//   // we don't need jest to go through other folders
//   testPathIgnorePatterns: [],
//   moduleFileExtensions: ['ts', 'js', 'json'],
//   // roots: [
//   //   "<rootDir>",
//   // ],
//   // modulePaths: [
//   //   "<rootDir>",
//   // ],
//   // This tells jest where to look for src modules
//   // moduleNameMapper: {
//   //   '^src/(.*)$': '<rootDir>/src/$1',
//   // },
//   // We are building a node server
//   testEnvironment: 'node',
//   // We must compile the ts files
//   transform: {
//     '^.+\\.(t|j)s$': 'ts-jest',
//   },
// }

import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['<rootDir>/test/**/*spec.ts'],
  testPathIgnorePatterns: [],
  moduleFileExtensions: ['ts', 'js'],
  // transform: {
  //   '^.+\\.(t|j)s$': 'ts-jest',
  // },
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
};
export default config;
