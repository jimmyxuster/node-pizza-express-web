'use strict';
const BaseController = require('./base');

class PayController extends BaseController {
  async wapPay() {
    const { id } = this.ctx.request.body;
    try {
      const payGateway = await this.ctx.service.alipay.wapPay(id);
      this.success({url: payGateway});
    } catch (e) {
      this.error(1000, e.message);
    }
  }
}

module.exports = PayController;
