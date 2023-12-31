module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-node',
    coverageDirectory: './coverage/',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    },
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname'
    ],
    setupFilesAfterEnv: ['./tests/setup-test.ts'],
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1'
    }
};
