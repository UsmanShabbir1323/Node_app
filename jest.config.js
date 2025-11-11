/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!jest.config.js', '!server.js', '!eslint.config.mjs'],
  setupFilesAfterEnv: [],
};


