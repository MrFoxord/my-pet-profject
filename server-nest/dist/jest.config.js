"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    rootDir: '.',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    },
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
    coverageDirectory: './coverage',
    clearMocks: true,
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map