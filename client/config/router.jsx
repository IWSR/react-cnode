import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';
import Loadable from 'react-loadable';

function Loading() {
  return <div>loading</div>;
}

const TopicList = Loadable({
  loader: () => import('../views/topic-list/index.jsx'),
  loading: Loading,
});

const TopicDetail = Loadable({
  loader: () => import('../views/topic-detail/index.jsx'),
  loading: Loading,
});

const TestApi = Loadable({
  loader: () => import('../views/test/api-test.jsx'),
  loading: Loading,
});

export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} exact key="first" />,
  <Route path="/list" component={TopicList} exact key="list" />,
  <Route path="/detail" component={TopicDetail} key="detail" />,
  <Route path="/test" component={TestApi} key="test" />,
];
