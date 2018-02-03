const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const ReactSSR = require('react-dom/server');
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
  const serverEntry = require('../dist/server-entry').default;
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

  // 设置静态文件
  app.use('/public', express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    const appString = ReactSSR.renderToString(serverEntry);
    res.send(template.replace('<app></app>', appString));
  });
} else {
  const devStatic = require('./util/dev-static');
  devStatic(app);
}

app.listen(3333, () => {
  console.log('server is listening on 3333');
});
