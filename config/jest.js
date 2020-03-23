const { resolve } = require('path');
//reference: jest-preset-preact
module.exports = {
    rootDir: resolve(__dirname, '../'),
    collectCoverageFrom: ['src/**/*.{mjs,js,jsx,ts,tsx}', '!src/**/*.d.ts'],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{mjs,js,jsx,ts,tsx}',
        '<rootDir>/{src,test,tests}/**/*.{spec,test}.{mjs,js,jsx,ts,tsx}',
    ],
    testEnvironment: 'jest-environment-jsdom-sixteen',
    transform: {
        '^.+\\.(mjs|js|jsx|ts|tsx)$': resolve(__dirname, 'babel-jest.js'),
    },
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(mjs|js|jsx|ts|tsx)$',
        '^.+\\.(css|sass|scss|less)$',
    ],
    moduleNameMapper: {
        '^react-dom$': 'preact/compat',
        '^react$': 'preact/compat',
        '^react-dom/test-utils$':'preact/test-utils',
        '^.+\\.(css|sass|scss|less)$': 'identity-obj-proxy',
    },
    "setupFiles": [
        "<rootDir>/config/setupTests.js"
    ]
};
