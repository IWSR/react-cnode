import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { lightBlue, pink } from 'material-ui/colors';

import App from './views/App.jsx';
import AppState from './store/app-state';

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    accent: pink,
    type: 'light',
  },
});

// 启动时渲染
// ReactDom.hydrate(<App />, document.getElementById('root'));

const initialState = window.__INITIAL__STATE__ || {}; // eslint-disable-line

const createApp = (TheApp) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    // render() {
    //   return <TheApp />,
    // }
    render = () => <TheApp />
  }

  return Main;
};

const root = document.getElementById('root');

const render = (Component) => {
  ReactDom.hydrate(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  );
};

render(createApp(App));

// 热更新替换
if (module.hot) {
  module.hot.accept('./views/App.jsx', () => {
    const NextApp = require('./views/App.jsx').default; //eslint-disable-line
    // ReactDom.hydrate(<NextApp />, document.getElementById('root'));
    render(createApp(NextApp));
  });
}
