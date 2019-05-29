module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/e2e/.*|(\\.|/)(test|spec))\\.(js|ts|tsx)?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/e2e/'],
  coverageDirectory: './coverage/',
  collectCoverage: true
};
