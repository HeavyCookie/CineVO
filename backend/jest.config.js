require('dotenv').config({ path: '../.env' })
const { pathsToModuleNameMapper } = require('ts-jest/utils') // eslint-disable-line
const { compilerOptions } = require('./tsconfig') // eslint-disable-line

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
}
