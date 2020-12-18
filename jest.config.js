module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '/tests/.*\.spec\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
      'node_modules',
      'dist',
      'tests'
  ]
};