/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {},
  extends: ['ts-prefixer'],
  globals: {},
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
  },
  plugins: [],
  root: true,
  rules: {
    'prettier/prettier': 'off',
  },
  settings: {},
}
