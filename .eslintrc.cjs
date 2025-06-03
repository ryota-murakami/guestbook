/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {},
  extends: ['ts-prefixer', 'next/core-web-vitals'],
  globals: {},
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
  },
  plugins: [],
  root: true,
  rules: {},
  settings: {},
}
