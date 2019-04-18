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
  router.get('/node_api/manage/dashboard', controller.dashboard.platformData);
  router.get('/node_api/manage/latestIncome', controller.dashboard.latestIncome);
  router.get('/node_api/manage/order/estimateDeliverTime', controller.order.estimateDeliverTime);
  router.get('/node_api/manage/materialCategory', controller.material.materialCategory);
  router.get('/node_api/manage/foodMaterials/:foodId', controller.material.foodMaterials);
  router.get('/node_api/manage/orderAmountRange', controller.dashboard.orderAmountRange);
  router.get('/node_api/manage/getLatestUserGrowth', controller.dashboard.getLatestUserGrowth);
  router.post('/node_api/manage/order/assignRider', controller.order.assignRider);
  router.post('/node_api/manage/order/cancelRider', controller.order.cancelRider);
  router.post('/node_api/manage/order/refund', controller.pay.refund);
  router.post('/node_api/upload', controller.upload.upload);
  router.put('/node_api/material/storage', controller.material.updateStorage);
  router.resources('menu', '/node_api/manage/menu', controller.menu);
  router.resources('category', '/node_api/manage/category', controller.category);
};
