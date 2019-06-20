const { resolve } = require('path');
const baseConfig = require('./base.config');
const devServerConfig = require('./dev-server.config');
const merge = require('webpack-merge');

const config = require('../app.config')({ production: false });

module.exports = merge(baseConfig(config), {
  mode: 'development',
  serve: devServerConfig
});
