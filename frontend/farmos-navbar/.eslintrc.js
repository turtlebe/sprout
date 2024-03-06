module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@plentyag/*',
            message: '@plentag/farmos-navbar is a shared NPM package, do not used any non-exportable dependencies',
          },
        ],
      },
    ],
  },
};
