/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

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
  config.middleware = [];

  config.cluster = {
    listen: {
      path: '',
      port: 8080,
      hostname: '0.0.0.0',
    }
  };

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

  return {
    ...config,
    ...userConfig,
  };
};
