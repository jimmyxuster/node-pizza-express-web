'use strict';
const BaseController = require('./base');

class PayController extends BaseController {
  async wapPay() {
    try {
      const payGateway = await this.ctx.service.alipay.wapPay(this.ctx.request.body);
      this.success({url: payGateway});
    } catch (e) {
      this.error(1000, e.message);
    }
  }
}

module.exports = PayController;
