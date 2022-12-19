module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '@exmpl/(.*)': '<rootDir>/src/$1',
  },
};