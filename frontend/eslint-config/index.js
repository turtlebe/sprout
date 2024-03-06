module.exports = {
  parser: require.resolve('@typescript-eslint/parser'), // Specifies the ESLint parser
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'import',
    'import-path',
    // 'prettier' commented as we don't want to run prettier through eslint because performance
  ],
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'prettier/react', // disables react-specific linting rules that conflict with prettier
  ],
  ignorePatterns: ['node_modules/', 'react-app-env.d.ts', '.eslintrc.js', 'dist/'],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    'import/extensions': ['.ts', '.tsx', '.js', '.jsx'],
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  rules: {
    /**
     * Custom regular Eslint rules
     */
    'max-params': ['error', { max: 3 }],
    /**
     * eslint-plugin-import
     */
    'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true, ignoreMemberSort: false }], // only use to sort members.
    'no-duplicate-imports': 'error',
    'no-restricted-imports': [
      'error',
      {
        name: '@material-ui/core',
        message: 'Please use @plentyag/brand-ui/src/material-ui/core instead.',
      },
      {
        name: '@material-ui/pickers',
        message: 'Please use @plentyag/brand-ui/src/material-ui/pickers instead.',
      },
    ],
    'import/no-unresolved': 0,
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', 'index', 'sibling'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import-path/parent-depth': ['error', 3],
    /**
     * TypeScript
     */
    '@typescript-eslint/adjacent-overload-signatures': 1,
    '@typescript-eslint/array-type': [1, { default: 'array' }],
    '@typescript-eslint/await-thenable': 1,
    '@typescript-eslint/ban-ts-ignore': 0,
    'brace-style': 0,
    '@typescript-eslint/brace-style': [1, '1tbs', { allowSingleLine: true }],
    '@typescript-eslint/class-name-casing': 0, // we disable it to allow TS interfaces to be any case
    '@typescript-eslint/consistent-type-assertions': [
      1,
      { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
    ],
    '@typescript-eslint/consistent-type-definitions': [1, 'interface'],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 1,
    'func-call-spacing': 0,
    '@typescript-eslint/func-call-spacing': 0, // prettier has it
    '@typescript-eslint/generic-type-naming': 0,
    '@typescript-eslint/indent': 0, // prettier has it
    '@typescript-eslint/interface-name-prefix': 0, // we want the types to have ability to be named exactly as values
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/member-ordering': [
      1,
      {
        default: [
          'public-static-field',
          'public-instance-field',
          'public-constructor',
          'private-static-field',
          'private-instance-field',
          'private-constructor',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
        ],
      },
    ],
    '@typescript-eslint/no-array-constructor': 0,
    'no-empty-function': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-empty-interface': [1, { allowSingleExtends: true }],
    '@typescript-eslint/no-explicit-any': 0,
    'no-extra-parens': 0,
    '@typescript-eslint/no-extra-parens': 0,
    '@typescript-eslint/no-extraneous-class': 1,
    '@typescript-eslint/no-floating-promises': [1, { ignoreVoid: true }],
    '@typescript-eslint/no-for-in-array': 1,
    '@typescript-eslint/no-inferrable-types': 1,
    'no-magic-numbers': 0,
    '@typescript-eslint/no-misused-new': 1,
    '@typescript-eslint/no-misused-promises': [1, { checksVoidReturn: false }],
    '@typescript-eslint/no-namespace': 1,
    '@typescript-eslint/no-non-null-assertion': 1,
    '@typescript-eslint/no-parameter-properties': 1,
    '@typescript-eslint/no-require-imports': 0,
    '@typescript-eslint/no-this-alias': 1,
    '@typescript-eslint/no-type-alias': 0,
    '@typescript-eslint/no-unnecessary-condition': 0, // doesn't work well
    '@typescript-eslint/no-unnecessary-qualifier': 1,
    '@typescript-eslint/no-unnecessary-type-arguments': 1,
    '@typescript-eslint/no-unnecessary-type-assertion': 1,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-use-before-define': 1,
    'no-useless-constructor': 0,
    '@typescript-eslint/no-useless-constructor': 1,
    '@typescript-eslint/no-var-requires': 1,
    '@typescript-eslint/prefer-for-of': 1,
    '@typescript-eslint/prefer-function-type': 1,
    '@typescript-eslint/prefer-includes': 1,
    '@typescript-eslint/prefer-namespace-keyword': 0,
    '@typescript-eslint/prefer-readonly': 1,
    '@typescript-eslint/prefer-regexp-exec': 1,
    '@typescript-eslint/prefer-string-starts-ends-with': 1,
    '@typescript-eslint/promise-function-async': 1,
    quotes: 0,
    '@typescript-eslint/quotes': [1, 'single', { avoidEscape: true }],
    '@typescript-eslint/require-array-sort-compare': 1,
    'require-await': 0,
    '@typescript-eslint/require-await': 1,
    '@typescript-eslint/restrict-plus-operands': 0,
    semi: 0,
    '@typescript-eslint/semi': 0,
    '@typescript-eslint/strict-boolean-expressions': 0, // doesn't work well
    '@typescript-eslint/triple-slash-reference': [1, { path: 'never', types: 'never', lib: 'never' }],
    '@typescript-eslint/type-annotation-spacing': 0,
    '@typescript-eslint/typedef': 0,
    '@typescript-eslint/unbound-method': 1,
    '@typescript-eslint/unified-signatures': 1,
    /**
     * These rules don't add much value, are better covered by TypeScript and good definition files
     */
    'react/no-direct-mutation-state': 0,
    'react/no-deprecated': 0,
    'react/no-string-refs': 0,
    'react/require-render-return': 0,
    /**
     * eslint-plugin-react
     */
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }], // also want to use with ".tsx"
    'react/prop-types': 0, // Is this incompatible with TS props type?
    /**
     * https://reactjs.org/docs/hooks-rules.html#eslint-plugin
     */
    'react-hooks/rules-of-hooks': 2, // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 0, // Checks effect dependencies
    'react/jsx-uses-vars': 2,
    'react/jsx-uses-react': 2,
    curly: 'error',
  },
};
