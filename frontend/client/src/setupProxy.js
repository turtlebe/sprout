/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve, join } = require('path');
const zlib = require('zlib');

const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config({ path: resolve(join(__dirname, '..', '..', '..', '.env')) });

const SPROUT_HOSTNAME = process.env.SPROUT_HOSTNAME || 'localhost';
const HYPOCOTYL_HOSTNAME = process.env.HYPOCOTYL_HOSTNAME || 'localhost';

const ROOT_PATH = '/';
const ERROR_ROUTES = ['/403'];
const FLASK_PATHS = ['/_debug_toolbar', '/static/css/', '/static/img/', '/static/js/js_all', '/static/favicon.ico'];
const REACT_STATIC_PATHS = ['/static/manifest'];
const SPROUT_ROUTES = ['/login', '/logout', '/api/', '/embedded-dashboards'];
const SERVER_PATHS = [...SPROUT_ROUTES, ...FLASK_PATHS, ...ERROR_ROUTES];
const HYPOCOTYL_PATHS = [
  '/hypocotyl',
  '/admin',
  '/controls',
  '/data/',
  '/devices/',
  '/env/',
  '/kpi',
  '/resources',
  '/sensory',
  '/traceability',
  '/profile',
];

const sproutFlaskFilter = pathname => {
  return pathname === ROOT_PATH || SERVER_PATHS.some(x => pathname.startsWith(x));
};

const sproutReactStaticFilter = pathname => {
  return REACT_STATIC_PATHS.some(x => pathname.startsWith(x));
};

const hypocotylFilter = pathname => {
  return HYPOCOTYL_PATHS.some(x => pathname.startsWith(x));
};

const hypocotylProxyRewrite = (proxyRes, req, res) => {
  /**
   * Replicates: https://github.com/PlentyAg/farmos-router/blob/master/nginx.conf
   * Reference: https://github.com/chimurai/http-proxy-middleware/issues/97
   */

  // For debugging
  // console.debug(proxyRes.headers, req.url);

  let originalBody = Buffer.from('');

  // accumulate data into body
  proxyRes.on('data', function (chunk) {
    originalBody = Buffer.concat([originalBody, chunk]);
  });

  // once all data is received, gunzip and update path if content type matches
  proxyRes.on('end', function () {
    let body = originalBody;

    if (proxyRes.headers['content-encoding'] === 'gzip') {
      body = zlib.gunzipSync(body);
    }

    // sub_filter_types text/css text/javascript application/javascript;
    if (
      ['text/html', 'text/css', 'text/javascript', 'application/javascript'].includes(proxyRes.headers['content-type'])
    ) {
      body = body.toString('utf-8').replace(/\/static\//g, '/hypocotyl/static/');
      body = Buffer.from(body, 'utf-8');
    }

    // gzip it again!
    if (proxyRes.headers['content-encoding'] === 'gzip') {
      body = zlib.gzipSync(body);
      res.set({
        'content-type': proxyRes.headers['content-type'],
        'content-encoding': proxyRes.headers['content-encoding'],
      });
    }

    // build response because `selfHandleResponse: true`
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    res.write(body);
    res.end();
  });
};

module.exports = app => {
  app.use(
    createProxyMiddleware(sproutReactStaticFilter, {
      target: 'http://localhost:3000',
      pathRewrite: {
        '^/static/': '/',
      },
    })
  );
  app.use(
    createProxyMiddleware(sproutFlaskFilter, {
      target: `http://${SPROUT_HOSTNAME}:8000`,
      // this is a work-around for bug associated with webpack dev-server where
      // it returns 502 rather than 304. it seems to be related to this problem:
      // https://github.com/chimurai/http-proxy-middleware/issues/381. It also
      // is possible flask is sending a malformed response that node can not handle.
      // this essentially means in local dev we are not caching flask assets.
      headers: {
        'Cache-Control': 'no-cache',
        'If-Modified-Since': '',
      },
    })
  );
  app.use(
    createProxyMiddleware(hypocotylFilter, {
      target: `http://${HYPOCOTYL_HOSTNAME}:8080`,
      pathRewrite: { '^/hypocotyl/static/': '/static/' },
      onProxyRes: hypocotylProxyRewrite,
      xfwd: true,

      // necessary to avoid res.end being called automatically
      selfHandleResponse: true,
    })
  );
};
