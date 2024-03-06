/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve, join } = require('path');

const { getLoader, loaderByName } = require('@craco/craco');
const dotenv = require('dotenv');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpack = require('webpack');

// load .env from /path/to/sprout/.env
dotenv.config({ path: resolve(join(__dirname, '..', '..', '.env')) });

const findIdxOfRuleWithOneOf = rules => {
  for (let i = 0; i < rules.length; i += 1) {
    if (rules[i].hasOwnProperty('oneOf')) {
      return i;
    }
  }
};

module.exports = {
  webpack: {
    configure(webpackConfig) {
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      };

      if (webpackConfig.mode === 'development') {
        // In production GOOGLE_CLIENT_ID comes from the runtime Flask environment variables.
        webpackConfig.plugins.push(
          new webpack.DefinePlugin({
            'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID),
          })
        );
      }
      if (webpackConfig.mode === 'production') {
        // only return on production builds, as this slow down dev builds.
        webpackConfig.plugins.push(
          new CircularDependencyPlugin({
            onDetected({ module: webpackModuleRecord, paths, compilation }) {
              // ignore simple circular dependency (3 or less), ex: file1.ts --> index.ts --> file1.ts
              if (paths.length > 3) {
                compilation.errors.push(new Error('Circular dependency found: ' + paths.join(' -> ')));
              }
            },
            // exclude detection of files based on a RegExp
            exclude: /.*\.js|node_modules/,
            // include specific files based on a RegExp
            include: /src/,
            // add errors to webpack instead of warnings
            failOnError: true,
            // allow import cycles that include an asyncronous import,
            // e.g. via import(/* webpackMode: "weak" */ './file.js')
            allowAsyncCycles: false,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
          })
        );
      }

      /**
       * Add TS support for symlinks:
       * @see https://github.com/facebook/create-react-app/issues/6556
       */
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        plugin => !(plugin instanceof ModuleScopePlugin)
      );
      const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'));
      if (isFound) {
        const babelLoader = { ...match.loader, include: /.+(\/|\\)src/ }; // RegEx for win & unix file systems resolution
        const unsafeIndexOfRule = findIdxOfRuleWithOneOf(webpackConfig.module.rules);
        webpackConfig.module.rules[unsafeIndexOfRule].oneOf[0] = babelLoader;
      }

      return webpackConfig;
    },
  },
};
