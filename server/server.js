const express = require('express');
const favicon = require('serve-favicon');
const ReactSSR = require('react-dom/server');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const app = express();

// icon
app.use(favicon(path.join(__dirname, '../cute.ico')));

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
