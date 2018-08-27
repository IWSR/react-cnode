const path = require('path');
const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const proxy = require('http-proxy-middleware');
const serverRender = require('./server-render');

const serverConfig = require('../../build/webpack.config.server');

const getTemplate = function () {
  return new Promise((resolve, reject) => {
    // 从内存中获取模板文件
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(error => {
        reject(error)
      })
  });
}

const NativeModule = require('module');
const vm = require('vm');

const getModuleFromString = (bundle, filename) => {
  const m = {
    exports: {}
  };
  // 使用原生的module模块包装了js文件的代码
  const wrapper = NativeModule.wrap(bundle);
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  });
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m;
}

const mfs = new MemoryFs();
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;
let serverBundle;

serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;
  stats = stats.toJson();
  stats.errors.forEach(err => console.error(err));
  stats.warnings.forEach(warn => console.warn(warn));

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  );
  // 这里获取的是stream
  const bundle = mfs.readFileSync(bundlePath, 'utf-8');
  // const m = new Module();
  // 把stream转换成可以使用的模块
  // 给这个模块赋一个名
  // m._compile(bundle, 'server-entry.js');
  const m = getModuleFromString(bundle, 'server-entry.js');
  serverBundle = m.exports;
});

module.exports = function (app) {
  // client的服务（热更新）是建立在8888端口下，因此在硬盘中找不到相关文件
  // 此时静态资源文件存在于内存中，访问/public（静态资源）需要代理到相关服务下
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }));

  app.get('*', (req, res, next) => {
    if (!serverBundle) {
      return res.send('waiting for compile, refresh later');
    }
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res);
    }).catch(next);
  })
}
