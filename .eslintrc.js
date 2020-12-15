module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    'no-empty': ['error', {allowEmptyCatch: true}],
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-expressions': ['error', {allowShortCircuit: true}],
  },
};
