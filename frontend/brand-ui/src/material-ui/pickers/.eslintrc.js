module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@plentyag/brand-ui/src/material-ui/pickers',
            message: 'Please use @material-ui/pickers instead.',
          },
        ],
      },
    ],
  },
};
