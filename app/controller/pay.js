'use strict';
const path = require('path');
const BaseController = require('./base');
const Alipay = require('../alipay/Alipay');
const alipayClient = new Alipay({
  appId: '2016092600602322',
  sandbox: true,
  notifyUrl: 'http://47.102.207.157:8080/node_api/notify',
  signType: 'RSA',
  rsaPrivate: path.join(__dirname, '../alipay/pem/private.pem'),
  rsaPublic: path.join(__dirname, '../alipay/pem/public.pem')
});

class PayController extends BaseController {
  async wapPay() {
    // const { body, subject, }
    const url = alipayClient.webPay({
      body: "ttt",
      subject: "ttt1",
      outTradeId: "201503200101010222",
      timeout: '15m',
      amount: "0.1",
      product_code: 'QUICK_WAP_PAY',
      goods_type: "1"
    });
    const url_API = 'https://openapi.alipaydev.com/gateway.do?'+url;
    this.success({url: url_API});
  }
}

module.exports = PayController;
