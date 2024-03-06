module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@plentyag/brand-ui/src/material-ui/core',
            message: 'Please use @material-ui/core instead.',
          },
        ],
      },
    ],
  },
};
