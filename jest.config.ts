import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const jestConfig: Config.InitialOptions = {
  verbose: true,
  roots: ['<rootDir>', '<rootDir>/tests'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  setupFiles: ['<rootDir>/tests/setup/plugin.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/global.ts'],
  testPathIgnorePatterns: ['<rootDir>/.github/', '<rootDir>/node_modules/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  transform: { '\\.ts$': 'ts-jest' },
  coverageReporters: ['text', 'text-summary', 'html'],
  coveragePathIgnorePatterns: ['<rootDir>/.github/', '<rootDir>/node_modules/', '<rootDir>/log/', '<rootDir>/mock/'],
  moduleFileExtensions: ['js', 'ts'],
};

export default jestConfig;
