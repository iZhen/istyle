process.env.NODE_ENV = 'development';

const path = require('path');
const express = require('express');
const postcssMiddleware = require('postcss-middleware');
const plugins = require('./plugins');

const app = express();
const port = 7701;
const root = path.join(__dirname, '../src/site');

app.use(/.*\.css$/, postcssMiddleware({
  src: req => path.join(root, req.baseUrl.replace(/\.css/i, ''), './main.css'),
  plugins,
}));

app.listen(port, () => console.log(`server listening on http://127.0.0.1:${port}`));
