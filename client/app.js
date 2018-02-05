import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import App from './views/App.jsx';

import AppState from './store/app-state';

// 启动时渲染
// ReactDom.hydrate(<App />, document.getElementById('root'));

const initialState = window.__INITIAL__STATE__ || {}; // eslint-disable-line

const root = document.getElementById('root');
const render = (Component) => {
  ReactDom.hydrate(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
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
