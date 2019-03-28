const path = require('path');
const lodash = require('lodash');
const Service = require('egg').Service;
const util = require('../alipay/util');
const Alipay = require('../alipay/Alipay');
const alipayClient = new Alipay({
  appId: '2016092600602322',
  sandbox: true,
  notifyUrl: 'http://47.102.207.157:8080/node_api/notify',
  signType: 'RSA',
  rsaPrivate: path.join(__dirname, '../alipay/pem/private.pem'),
  rsaPublic: path.join(__dirname, '../alipay/pem/public.pem')
});
const STATUS_MAP = {
  'TRADE_SUCCESS': 1,
  'TRADE_CLOSED': -2
};

class AlipayService extends Service {
  async wapPay(opts) {
    const { orderId, returnUrl } = opts;
    console.log(`${this.app.config.proxy.target}PizzaExpress-api/Public/demo/`)
    let response = await util.request({
      url: `${this.app.config.proxy.target}PizzaExpress-api/Public/demo/`,
      method: 'POST',
      type: 'application/x-www-form-urlencoded',
      form: {
        service: 'Order.GetBaseInfo',
        order_id: orderId
      }
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
      const outTradeId = `${Date.now()}${orderId}`;
      const url = alipayClient.webPay({
        body,
        subject: `订单${orderId}`,
        outTradeId,
        timeout: '15m',
        amount: lodash.get(response, ['data', 'price']) || '0.1',
        product_code: 'QUICK_WAP_PAY',
        goods_type: "1",
        returnUrl
      });
      await this.app.mysql.update('order', {
        id: +orderId,
        outTradeId
      });
      return 'https://openapi.alipaydev.com/gateway.do?' + url;
    } else {
      throw new Error('查询订单失败');
    }
  }
  async notify (body) {
    if (util.signVerify(body)) {
      const { out_trade_id: outTradeId, trade_status } = body;
      const status = STATUS_MAP[trade_status];
      if (status) {
        await this.app.mysql.update('order', {status}, {where: {outTradeId}, columns: ['status']});
        this.ctx.logger.info('Payment success, outTradeId is %s', outTradeId);
      }
    } else {
      this.ctx.logger.warn('SignVerifyFailed, request body: %j', body);
      throw new Error('SignVerify Failed');
    }
  }
}

module.exports = AlipayService;