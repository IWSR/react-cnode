import React from 'react';
import {
  observer,
  inject,
} from 'mobx-react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Helmet from 'react-helmet';
import { AppState } from '../../store/app-state';
import Container from '../layout/container.jsx';

@inject('appState') @observer
export default class TopicList extends React.Component {
  constructor() {
    super();
    this.changeName = this.changeName.bind(this);
  }

  componentDidMount() {
    // do something
  }

  // asyncBootstrap提供的方法
  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3;
        resolve(true);
      });
    });
  }

  changeName(event) {
    this.props.appState.changeName(event.target.value);
  }

  render() {
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="this is description" />
        </Helmet>
        <Button raised="true" color="primary" >This is button</Button>
        <input type="text" onChange={this.changeName} />
        <span>{this.props.appState.msg}</span>
      </Container>
    );
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
};
