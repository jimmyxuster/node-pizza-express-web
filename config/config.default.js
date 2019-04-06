/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

function isObject(value) {
  const type = typeof value;
  return !!value && (type === 'object' || type === 'function');
}

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1553062333009_9507';

  // add your middleware config here
  config.middleware = ['proxy'];

  config.cluster = {
    listen: {
      path: '',
      port: 8080,
      hostname: '0.0.0.0',
    }
  };

  config.logger = {
    disableConsoleAfterReady: false,
  };

  config.proxy = {
    match: '/api',
    target: 'http://54.211.21.205/',
    proxyReqPathResolver: (ctx) => {
      return '/PizzaExpress-api/Public/demo/' + ctx.request.search
    },
    proxyReqOptDecorator: function(proxyReqOpts, ctx) {
      proxyReqOpts.headers['content-type'] = 'application/x-www-form-urlencoded';
      return proxyReqOpts;
    },
    proxyReqBodyDecorator: function(bodyContent, ctx) {
      let formBody = '';
      if (typeof bodyContent === 'object') {
        for (let key in bodyContent) {
          if (formBody.length) {
            formBody += '&';
          }
          let value = isObject(bodyContent[key]) ? JSON.stringify(bodyContent[key]) : bodyContent[key]
          formBody += `${key}=${value}`;
        }
      }
      return formBody;
    }
  }

  config.static = {
    dir: [
      {
        dir: path.join(appInfo.baseDir, 'app/public/images/'),
        prefix: '/images/'
      },
      {
        dir: path.join(appInfo.baseDir, 'app/public/'),
        prefix: '/'
      }
    ]
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false
    }
  };

  config.mysql = {
    client: {
      host: 'pizza-express.ccz15ohowdvl.us-east-1.rds.amazonaws.com',
      port: '3306',
      user: 'root',
      password: 'pizzaexpressapp',
      database: 'pizza_express',
    }
  };

  config.multipart = {
    mode: 'file'
  };

  config.bodyParser = {
    jsonLimit: '20mb',
    formLimit: '20mb',
  };

  return {
    ...config,
    ...userConfig,
  };
};
