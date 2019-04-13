const Service = require('egg').Service;

const platformDashboards = [
  {
    name: '平台订单数',
    sql: 'SELECT count(*) as count FROM `order`',
  },
  {
    name: '进行中订单数',
    sql: 'SELECT count(*) as count FROM `order` where status > 0 and status < 4',
  },
  {
    name: '待处理退款数',
    sql: 'SELECT count(*) as count FROM `order` where status = -1',
  },
  {
    name: '平台客户数',
    sql: 'SELECT count(*) as count FROM `user`',
  },
];

class DashboardService extends Service {
  async platform() {
    try {
      const results = await Promise.all(platformDashboards.map(item => this.app.mysql.query(item.sql)));
      return results.map((result, index) => ({
        name: platformDashboards[index].name,
        value: result[0].count,
      }));
    } catch (e) {
      console.error(e)
      return null;
    }
  }
}

module.exports = DashboardService;
