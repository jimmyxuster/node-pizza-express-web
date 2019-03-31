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
      await this.ctx.service.alipay.notify(this.ctx.request.body);
      this.ctx.body = 'success';
    } catch (e) {
      this.ctx.logger.info('Notify Fail!!!', e.message);
      this.ctx.body = 'fail';
    }
  }
  async refund() {
    const { id } = this.ctx.request.body;
    if (!id) {
      this.ctx.throw(400);
      return;
    }
    try {
      await this.ctx.service.alipay.refund(id);
      this.success();
    } catch (e) {
      this.error(1000, '退款失败，错误信息：' + e.message);
    }
  }
}

module.exports = PayController;
