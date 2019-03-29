const Service = require('egg').Service;

class UserService extends Service {
  async requestRefund (body) {
    const { orderId: id, refundReason } = body;
    if (id && refundReason) {
      await this.app.mysql.update('order', {id, refundReason, status: '-1'});
    } else {
      throw new Error('缺少必要信息');
    }
  }
  async getOrders (body) {
    const { page = 0, pageSize = 10, ...restProps } = body;
    const rows = await this.app.mysql.select('order', 
      {
        where: restProps,
        orders: [['id', 'desc']],
        limit: +pageSize,
        offset: page * pageSize
      }
    )
    const total = await this.app.mysql.count('order', restProps);
    return {
      data: rows,
      total
    }
  }
}

module.exports = UserService;