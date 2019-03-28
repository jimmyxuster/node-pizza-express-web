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
  async notify() {
    try {
      this.ctx.logger.info('Notify', JSON.stringify(this.ctx.request.body));
      await this.ctx.service.alipay.notify(this.ctx.request.body);
      this.ctx.body = 'success';
    } catch (e) {
      this.ctx.body = 'fail';
    }
  }
}

module.exports = PayController;
