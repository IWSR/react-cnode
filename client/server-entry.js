// 服务端内不存在document对象（浏览器环境）
// 因此在服务端渲染时需要新建该文件作为服务端渲染的入口

import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react';
import { JssProvider } from 'react-jss';
import { MuiThemeProvider } from 'material-ui/styles';

import App from './views/App.jsx';

import { createStoreMap } from './store/store';

// mobx在服务端渲染时不会重复数据变换
useStaticRendering(true);

export default (stores, routerContext, sheetsRegistry, jss, theme, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <JssProvider registry={sheetsRegistry} jss={jss}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>
  </Provider>
);

export {
  createStoreMap,
};
