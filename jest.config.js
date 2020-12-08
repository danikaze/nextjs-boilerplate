const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');
const { getConstants } = require('./build-tools/build-time-constants');

const serverBuildTimeConstants = getConstants({
  type: 'server',
  dev: true,
  isServer: true,
  isTest: true,
});

module.exports = {
  transform: {
    // Use official TypeScript Jest transformer
    '\\.(ts|tsx)?$': 'ts-jest',
    // Use our custom transformer only for the *.js and *.jsx files
    '\\.(js|jsx)?$': '<rootDir>/test/transform.js',
    // Custom transformer for statics, to output its path as a string
    '\\.(jpg|png|gif|svg|ttf|woff)?$': '<rootDir>/test/transform-path.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!(lodash-es)/)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/*.(test|spec).(ts|tsx)'],
  globals: {
    ...serverBuildTimeConstants,
    'ts-jest': {
      babelConfig: true,
      tsconfig: 'tsconfig.json',
    },
  },
  setupFilesAfterEnv: [],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/.coverage',
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  collectCoverageFrom: ['<rootDir>/utils/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
