import type { Config } from '@jest/types';

const jestConfig: Config.InitialOptions = {
  verbose: true,
  testPathIgnorePatterns: ['<rootDir>/.github/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '@models/(.*)': '<rootDir>/models/$1',
    '@controllers/(.*)': '<rootDir>/controllers/$1',
    '@functions/(.*)': '<rootDir>/functions/$1',
    '@middleware/(.*)': '<rootDir>/middleware/$1',
    '@routes/(.*)': '<rootDir>/routes/$1',
    '@services/(.*)': '<rootDir>/services/$1',
    '@coreTypes/(.*)': '<rootDir>/types/$1',
    '@mock/(.*)': '<rootDir>/mock/$1',
    '@utils/(.*)': '<rootDir>/utils/$1',
    '@error/(.*)': '<rootDir>/error/$1',
    '@db/(.*)': '<rootDir>/db/$1',
    '@setup/(.*)': '<rootDir>/tests/setup/$1',
  },
  transform: {
    '\\.ts$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['<rootDir>/.github/', '<rootDir>/node_modules/', '<rootDir>/log/', '<rootDir>/mock/'],
  moduleFileExtensions: ['js', 'ts'],
};

export default jestConfig;
