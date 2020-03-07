module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsConfig: {
        jsx: 'react',
      },
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
