const BaseController = require('./base');

class OrderController extends BaseController {
  async requestRefund () {
    try {
      await this.ctx.service.order.requestRefund(this.ctx.request.body);
      this.success();
    } catch (e) {
      this.error('保存退款信息失败');
    }
  }
  async getOrders () {
    try {
      const data = await this.ctx.service.order.getOrders(this.ctx.request.query);
      this.success(data)
    } catch (e) {
      this.error('获取订单失败');
    }
  }
}

module.exports = OrderController;