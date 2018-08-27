const path = require('path');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');

module.exports = webpackMerge(baseConfig, {
  // js的打包内容执行在哪个环境下
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  // 这里被依赖的包不会被打包进去
  // 因为打包内容是在node下，所以可以直接引用node_modules
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  }
});