const proxy = require('koa-better-http-proxy');

module.exports = (options, app) => {
  return proxy(options.target, options);
}