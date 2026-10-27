/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/dist/__tests__'],
  testMatch: ['**/*.test.js', '**/*.spec.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)$': '$1',
  },
  collectCoverageFrom: [
    'dist/**/*.js',
    '!dist/**/*.d.ts',
    '!dist/scripts/**',
    '!dist/migrations/**',
    '!dist/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['js', 'json'],
  verbose: true,
  testTimeout: 10000,
  passWithNoTests: true,
};
