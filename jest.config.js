module.exports = {
  roots: ['<rootDir>/e2e/'],
  transform: {
    '^.+\\.(tsx|ts)?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/e2e/', '/.vscode/', '/.github/'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      lines: 60
    }
  }
};
