import type { Config } from 'jest';
const config: Config = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  modulePaths: ['<rootDir>/../'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testTimeout: Number(process.env.notifyBcJestTestTimeout) || 5000,
};
export default config;
