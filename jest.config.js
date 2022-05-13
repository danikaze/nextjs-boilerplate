/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest');
const {
  requireFromProject,
} = require('./dist/build-tools/require-from-project');
const { compilerOptions } = requireFromProject('tsconfig.json');
const { getConstants } = requireFromProject('build-tools/build-time-constants');

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
  globals: {
    ...serverBuildTimeConstants,
    'ts-jest': {
      babelConfig: true,
      tsconfig: 'tsconfig.json',
    },
  },
  setupFilesAfterEnv: [],
  testMatch: ['**/*.(test|spec).(ts|tsx)'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/.coverage',
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  collectCoverageFrom: ['<rootDir>/utils/**/*.{ts,tsx}', '!**/*.d.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/build-tools/'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),

    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': `<rootDir>/__mocks__/fileMock.js`,
  },

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};
