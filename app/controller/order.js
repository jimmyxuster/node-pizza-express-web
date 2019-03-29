const BaseController = require('./base');

class OrderController extends BaseController {
  async requestRefund () {
    try {
      await this.ctx.service.order.requestRefund(this.ctx.request.body);
      this.success();
    } catch (e) {
      this.fail('保存退款信息失败');
    }
  }
}

module.exports = OrderController;