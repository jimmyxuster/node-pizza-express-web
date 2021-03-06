const Service = require('egg').Service;
const moment = require('moment');

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

  async getLatestIncome() {
    const incomes = [];
    try {
      const now = moment().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
      for (let i = 0; i < 7; i++) {
        const sql = `SELECT sum(price) as sum FROM \`order\` WHERE status > -2 AND createTime >= '${now.format('YYYY-MM-DD HH:mm:ss')}' AND createTime < '${now.add(1, 'd').format('YYYY-MM-DD HH:mm:ss')}'`;
        const result = await this.app.mysql.query(sql);
        now.subtract(1, 'd');
        incomes.unshift({
          sum: result[0].sum || 0,
          date: now.format('YYYY-MM-DD'),
        });
        now.subtract(1, 'd');
      }
      return incomes;
    } catch (e) {
      console.error(e)
      return null;
    }
  }

  async getOrderAmountRange() {
    const result = [];
    const range = [[0, 49], [50, 99], [100]];
    try {
      await Promise.all(range.map(r => (async () => {
        const { count } = await this.app.mysql.queryOne(`SELECT count(*) as count FROM \`order\` WHERE price >= ${r[0]} ${r[1] ? 'AND price <= ' + r[1] : ''}`);
        result.push({
          range: r.length === 1 ? `${r[0]}以上` : `${r[0]}~${r[1]}`,
          count,
        });
      })()));
      return result;
    } catch (e) {
      console.error(e)
      return null;
    }
  }

  async getLatestUserGrowth() {
    const newUserCount = [];
    try {
      const now = moment().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
      for (let i = 0; i < 5; i++) {
        const sql = `SELECT count(*) as count FROM \`user\` WHERE createTime >= '${now.format('YYYY-MM-DD HH:mm:ss')}' AND createTime < '${now.add(1, 'd').format('YYYY-MM-DD HH:mm:ss')}'`;
        const result = await this.app.mysql.query(sql);
        now.subtract(1, 'd');
        newUserCount.unshift({
          count: result[0].count || 0,
          date: now.format('MM-DD'),
        });
        now.subtract(1, 'd');
      }
      return newUserCount;
    } catch (e) {
      console.error(e)
      return null;
    }
  }
}

module.exports = DashboardService;
