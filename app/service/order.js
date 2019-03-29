const Service = require('egg').Service;

class UserService extends Service {
  async requestRefund (body) {
    const { orderId: id, refundReason } = body;
    if (id && refundReason) {
      await this.app.mysql.update('order', {id, refundReason});
    } else {
      throw new Error('缺少必要信息');
    }
  }
}

module.exports = UserService;