const path = require('path');

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'),
    // 静态资源的引用路径
    publicPath: '/public/'
  },
  // 这样可以忽略后缀名，webpack也能找到
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        // 确保在真正执行编译之前执行eslint-loader
        // 一旦编译报错终止执行接下去的程序
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      // node_modules内的js文件不需要被再次编译
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      }
    ]
  }
}
