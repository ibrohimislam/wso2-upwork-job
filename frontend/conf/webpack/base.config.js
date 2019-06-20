const { resolve } = require('path');
const customLoaders = require('./custom-loaders');
const { HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (config) => ({
  entry: {
    ...config.app.transpile && { polyfills: '@babel/polyfill' },
    'wc/webcomponents-loader': resolve(__dirname, '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader'),
    'web-animations-js': resolve(__dirname, '../../node_modules/web-animations-js/web-animations-next.min.js'),
    'whatwg-fetch': 'whatwg-fetch',
    'app': resolve(__dirname, '../../src/bootstrap'),
    'login-callback': resolve(__dirname, '../../src/login-callback'),
  },
  output: {
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/components/[id].js',
    path: resolve(__dirname, '../..', config.outputDir),
  },
  resolveLoader: {
    // You can add your own custom loaders inside the `custom-loaders` directory
    // you don't need to include them anywhere, as they will automatically be included
    // e.g. The `minify-template.loader.js` is automatically loaded as `minify-template-loader`
    alias: customLoaders,
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.sass', '.html'],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        extractComments: true,
        sourceMap: true
      }),
    ],
    splitChunks: {
      // TODO: Checkout why this option isn't working.
      // The default value is 'async', but setting it to 'all' is suggested.
      // See https://github.com/webpack/webpack.js.org/blob/master/src/content/plugins/split-chunks-plugin.md#optimizationsplitchunkschunks-all
      // chunks: 'all',
      name: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: 'to-string-loader',
          },
          {
            loader: 'raw-loader',
            options: {
              config: {
                path: resolve(__dirname, '../postcss.config.js'),
                ctx: config,
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            exportAsEs6Default: true,
            minimize: true,
          },
        },
      },
      ...config.app.transpile ? [{
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            'syntax-dynamic-import',
          ],
        },
      }] : [],
      {
        test: /\.ts$/,
        use: [
          ...config.app.transpile ? [{
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                'syntax-dynamic-import',
              ],
            },
          }] : [],
          {
            loader: 'ts-loader',
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.[jt]s$/,
        use: {
          loader: 'minify-template-loader',
          options: {
            caseSensitive: true,
            collapseWhitespace: true,
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([config.outputDir], { root: resolve(__dirname, '../..') }),
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      config,
      hash: true,
      inject: true,
      template: `!!handlebars-loader!${resolve(__dirname, '../../src/index.hbs')}`,
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      config,
      hash: true,
      inject: true,
      chunks: ['login-callback'],
      template: `!!handlebars-loader!${resolve(__dirname, '../../src/login-callback.hbs')}`,
      filename: 'login-callback.html'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defer: ['webcomponents-loader.js', 'app.js'],
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      // Custom Elements ES5 adapter
      {
        from: resolve(__dirname, '../../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'),
        to: './scripts/wc',
        flatten: true,
      },
      // WebComponents Polyfills
      {
        from: resolve(__dirname, '../../node_modules/@webcomponents/webcomponentsjs/bundles/**/*'),
        to: './scripts/wc/bundles',
        flatten: true,
      },
    ]),
  ],
  devtool: 'source-map',
});
