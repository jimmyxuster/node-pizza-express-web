const path = require('path');
const lodash = require('lodash');
const Service = require('egg').Service;
const request = require('../alipay/util').request;
const Alipay = require('../alipay/Alipay');
const alipayClient = new Alipay({
  appId: '2016092600602322',
  sandbox: true,
  notifyUrl: 'http://47.102.207.157:8080/node_api/notify',
  signType: 'RSA',
  rsaPrivate: path.join(__dirname, '../alipay/pem/private.pem'),
  rsaPublic: path.join(__dirname, '../alipay/pem/public.pem')
});

class AlipayService extends Service {
  async wapPay(orderId) {
    let response = await request({
      url: `${this.app.config.proxy.target}PizzaExpress-api/Public/demo/`,
      method: 'POST',
      type: 'application/x-www-form-urlencoded',
      body: `service=Order.GetBaseInfo&order_id=${orderId}`
    })
    if (response) {
      response = response.json();
      const foodOrder = lodash.get(response, ['data', 'foodOrder']);
      let body = '匹萨订单';
      if (Array.isArray(foodOrder) && foodOrder.length) {
        body = lodash.get(foodOrder, ['0', 'foodName'])
        body = body ? `${body}等${foodOrder.length}件商品` : '匹萨订单';
      }
      const orderId = lodash.get(response, ['data', 'id']);
      if (lodash.isNil(orderId)) {
        throw new Error('订单数据非法');
      }
      const url = alipayClient.webPay({
        body,
        subject: `订单${orderId}`,
        outTradeId: `${Date.now()}${orderId}`,
        timeout: '15m',
        amount: lodash.get(response, ['data', 'price']) || '0.1',
        product_code: 'QUICK_WAP_PAY',
        goods_type: "1"
      });
      return 'https://openapi.alipaydev.com/gateway.do?' + url;
    } else {
      throw new Error('查询订单失败');
    }
  }
}

module.exports = AlipayService;