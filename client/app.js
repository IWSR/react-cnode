import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import App from './views/App.jsx';

// 启动时渲染
// ReactDom.hydrate(<App />, document.getElementById('root'));

const root = document.getElementById('root');
const render = (Component) => {
  ReactDom.hydrate(
    <AppContainer>
      <Component />
    </AppContainer>,
    root,
  );
};

render(App);

// 热更新替换
if (module.hot) {
  module.hot.accept('./views/App.jsx', () => {
    const NextApp = require('./views/App.jsx').default; //eslint-disable-line
    // ReactDom.hydrate(<NextApp />, document.getElementById('root'));
    render(NextApp);
  });
}
