import React from 'react';
// import {
//   Link,
// } from 'react-router-dom';
import Routes from '../config/router.jsx';

import AppBar from './layout/app-bar.jsx';

export default class App extends React.Component {
  componentDidMount() {
    // do something
  }

  render() {
    return [
      <AppBar />,
      <Routes key="routes" />,
    ];
  }
}

