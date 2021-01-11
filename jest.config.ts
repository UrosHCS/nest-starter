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
    "^(src|test)/(.*)$": "<rootDir>/$1/$2",
  },
};
export default config;
