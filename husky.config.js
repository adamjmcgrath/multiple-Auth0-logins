module.exports = {
  hooks: {
    'pre-commit': 'lint-staged && npm run type && npm run size',
  },
};
