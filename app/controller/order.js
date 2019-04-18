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
      const data = await this.ctx.service.order.getOrders({...this.ctx.request.query, ...this.ctx.request.queries});
      this.success(data)
    } catch (e) {
      console.error(e);
      this.error('获取订单失败');
    }
  }
  async assignRider () {
    try {
      await this.ctx.service.order.assignRider(this.ctx.request.body);
      this.success();
    } catch (e) {
      this.error('分配骑手失败');
    }
  }
}

module.exports = OrderController;