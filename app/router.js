'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.put('/node_api/user', controller.user.update);
  router.post('/node_api/wapPay', controller.pay.wapPay);
};
