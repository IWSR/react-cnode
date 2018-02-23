const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const serverRender = require('./util/server-render');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// 目前存在内存中
app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}));

// icon
app.use(favicon(path.join(__dirname, '../cute.ico')));

app.use('/api/user', require('./util/handle-login'));

app.use('/api', require('./util/proxy'));

if (!isDev) {
  const serverEntry = require('../dist/server-entry');
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8');

  // 设置静态文件
  app.use('/public', express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res, next) => {
    serverRender(serverEntry, template, req, res).catch(next);
  });
} else {
  const devStatic = require('./util/dev-static');
  devStatic(app);
}

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send(error);
});

app.listen(3333, () => {
  console.log('server is listening on 3333');
});
