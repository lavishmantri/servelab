const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { token } = require('morgan');

const app = express();

// Logging
app.use(morgan('dev'));

// Configuration
const PORT = 4000;
const HOST = 'localhost';
const API_SERVICE_URL = 'https://jupyterhub.dev.markovml.com';

app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});
// Info GET endpoint
app.get('/info', (req, res, next) => {
  res.send(
    'This is a proxy service which proxies to Billing and Account APIs.',
  );
});

// Proxy endpoints
app.use(
  '/jupyterlab-proxy',
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/jupyterlab-proxy`]: '',
    },
  }),
);
app.use(
  '/user/*',
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

app.use(
  '/hub/user/*',
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    ws: true,
  }),
);

// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
