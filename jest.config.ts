import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const jestConfig: Config.InitialOptions = {
  verbose: true,
  roots: ['<rootDir>', '<rootDir>/tests'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', '<rootDir>/__mocks__'],
  setupFiles: ['<rootDir>/tests/setup/plugin.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/global.ts'],
  testMatch: ['<rootDir>/tests/**/*.ts'],
  testPathIgnorePatterns: ['<rootDir>/tests/s(w)*'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: { '\\.ts$': 'ts-jest' },
  coverageReporters: ['text', 'text-summary', 'html'],
  coveragePathIgnorePatterns: [
    '<rootDir>/.github/',
    '<rootDir>/node_modules/',
    '<rootDir>/log/',
    '<rootDir>/mock/',
    '<rootDir>/tests/s(w)*',
  ],
  moduleFileExtensions: ['js', 'ts'],
};

export default jestConfig;
