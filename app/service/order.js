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
    const _whereExp = this.app.mysql._where(restProps);
    const whereExp = _whereExp.length ? `${_whereExp} AND order.id = foodorder.orderId` : ' WHERE order.id = foodorder.orderId ';
    const offsetExp = this.app.mysql._limit(+pageSize, page * pageSize);
    const rows = await this.app.mysql.query(`SELECT *, count(order.id) as foodCount FROM \`order\` join \`foodorder\` ${whereExp} GROUP BY order.id ORDER BY order.id DESC ${offsetExp}`);
    const total = await this.app.mysql.query(`SELECT count(*) as total from (SELECT order.id FROM \`order\` join \`foodorder\` ${whereExp} GROUP BY order.id) as child`);
    return {
      data: rows,
      total: total[0].total,
    }
  }
}

module.exports = UserService;