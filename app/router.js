'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.put('/node_api/user', controller.user.update);
  router.post('/node_api/wapPay', controller.pay.wapPay);
  router.post('/node_api/appPay', controller.pay.appPay);
  router.post('/node_api/notify', controller.pay.notify);
  router.post('/node_api/order/requestRefund', controller.order.requestRefund);
  router.get('/node_api/manage/order', controller.order.getOrders);
  router.post('/node_api/manage/order/refund', controller.pay.refund);
  router.post('/node_api/upload', controller.upload.upload);
  router.resources('menu', '/node_api/manage/menu', controller.menu);
  router.resources('category', '/node_api/manage/category', controller.category);
};
