const ReactDomServer = require('react-dom/server');
const serialize = require('serialize-javascript');
const ejs = require('ejs');
const asyncBootstrap = require('react-async-bootstrapper').default;
const Helmet = require('react-helmet').default;

const SheetsRegistry = require('react-jss').SheetsRegistry;
const create = require('jss').create;
const preset = require('jss-preset-default').default;
const createMuiTheme = require('material-ui/styles').createMuiTheme;
const createGenerateClassName = require('material-ui/styles/createGenerateClassName').default;
const colors = require('material-ui/colors');

const getStoreState = (stores) => {
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {});
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap;
    const createApp = bundle.default;
    const routerContext = {};
    const stores = createStoreMap();
    const sheetsRegistry = new SheetsRegistry();
    const jss = create(preset());
    jss.options.createGenerateClassName = createGenerateClassName;
    const theme = createMuiTheme({
      palette: {
        primary: colors.pink,
        accent: colors.lightBlue,
        type: 'light'
      }
    });
    const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url);
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

      const helmet = Helmet.rewind();
      const state = getStoreState(stores);
      const content = ReactDomServer.renderToString(app);

      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      });
      // res.send(template.replace('<!-- app -->', content));
      res.send(html);
      resolve();
    }).catch(reject);
  });
}
