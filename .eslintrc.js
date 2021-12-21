module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@next/next/recommended',
  ],
  rules: {
    'no-console': 'error',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  globals: {
    React: 'writable',
  },
  settings: {
    react: {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      version: require('react/package.json').version,
    },
  },
};
