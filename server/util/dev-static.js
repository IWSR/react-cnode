const path = require('path');
const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const ReactDomServer = require('react-dom/server');
const proxy = require('http-proxy-middleware');
const serialize = require('serialize-javascript');
const ejs = require('ejs');
const asyncBootstrap = require('react-async-bootstrapper').default;

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

const Module = module.constructor;
const mfs = new MemoryFs();
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;
let serverBundle, createStoreMap;

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
  const m = new Module();
  // 把stream转换成可以使用的模块
  // 给这个模块赋一个名
  m._compile(bundle, 'server-entry.js');
  serverBundle = m.exports.default;
  createStoreMap = m.exports.createStoreMap;
});

const getStoreState = (stores) => {
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {});
}

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }));

  app.get('*', (req, res) => {
    getTemplate().then(template => {
      const routerContext = {};
      const stores = createStoreMap();
      const app = serverBundle(stores, routerContext, req.url);
      // asyncBootstrap
      asyncBootstrap(app).then(() => {
        // react-router会给routerContext增加属性
        // 查看是否有重定向
        if (routerContext.url) {
          // 重定向
          res.status(302).setHeader('Location', routerContext.url);
          res.end();
          return
        }
        const state = getStoreState(stores);
        const content = ReactDomServer.renderToString(app);

        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state)
        });
        // res.send(template.replace('<!-- app -->', content));
        res.send(html);
      });
    });
  })
}
