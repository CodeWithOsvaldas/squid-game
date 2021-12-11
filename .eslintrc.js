module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['dist'],
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'no-use-before-define': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-globals': 'off',
    'class-methods-use-this': 'off',
    'max-classes-per-file': 'off',
    'no-param-reassign': 'off',
    'import/no-cycle': 'off',
    'max-len': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
  },
};
