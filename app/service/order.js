const Service = require('egg').Service;
const moment = require('moment');
const util = require('../alipay/util');

const getTimeRangeWhere = (column, range) => {
  if (!range) return '';
  if (!Array.isArray(range)) {
    range = [range];
  }
  let rangePoints = [];
  [0, 1].forEach(index => {
    if (range[index]) {
      rangePoints.push(moment(range[index].replace(/(^"|"$)/g, '')).format('YYYY-MM-DD HH:mm:ss'));
    }
  });
  return rangePoints.map((point, index) => ` ${column} ${index === 0 ? '>' : '<'} '${point}' `).join('AND');
}

class UserService extends Service {
  async requestRefund (body) {
    const { orderId: id, refundReason } = body;
    if (id && refundReason) {
      await this.app.mysql.update('order', {id, refundReason, status: '-1'});
    } else {
      throw new Error('缺少必要信息');
    }
  }
  async getOrders (query) {
    const { page = 0, pageSize = 10, 'createTime[]': createTimeArr, 'arriveTime[]': arriveTimeArr, createTime, arriveTime, ...restProps } = query;
    let whereExp = this.app.mysql._where(restProps);
    const rangeWheres = [getTimeRangeWhere('order.createTime', createTime), getTimeRangeWhere('order.arriveTime', arriveTime)].filter(str => str !== '').join('AND');
    whereExp = whereExp.trim().length ? `${whereExp} ${rangeWheres ? 'AND' : ''} ${rangeWheres}` : ` ${rangeWheres ? 'WHERE' : ''} ${rangeWheres}`;
    whereExp = whereExp.trim().length ? `${whereExp} AND order.id = foodorder.orderId` : ' WHERE order.id = foodorder.orderId ';
    const offsetExp = this.app.mysql._limit(+pageSize, page * pageSize);
    console.error('sql:', `SELECT *, count(order.id) as foodCount FROM \`order\` join \`foodorder\` ${whereExp} GROUP BY order.id ORDER BY order.id DESC ${offsetExp}`)
    const rows = await this.app.mysql.query(`SELECT *, count(order.id) as foodCount FROM \`order\` join \`foodorder\` ${whereExp} GROUP BY order.id ORDER BY order.id DESC ${offsetExp}`);
    const total = await this.app.mysql.query(`SELECT count(*) as total from (SELECT order.id FROM \`order\` join \`foodorder\` ${whereExp} GROUP BY order.id) as child`);
    return {
      data: rows,
      total: total[0].total,
    }
  }
  async assignRider ({ riderId, orderId }) {
    await this.app.mysql.update('order', {
      id: orderId,
      riderId,
    });
  }
  async cancelRider ({orderId}) {
    await this.app.mysql.query('UPDATE `order` SET riderId = NULL WHERE id = ' + orderId);
  }
  async estimateDeliverTime ({lat, lng, factoryId}) {
    const rows = await this.app.mysql.select('factory', { 
      where: {id: factoryId},
      columns: ['lng', 'lat'],
    });
    if (rows[0]) {
      const { lng: facLng, lat: facLat } = rows[0];
      let response = await util.request({
        url: `http://restapi.amap.com/v4/direction/bicycling?key=844bb6fb83ca83a309ee6eca3fe040dc&origin=${lng},${lat}&destination=${facLng},${facLat}`,
        method: 'GET',
      });
      if (response) {
        response = response.json();
        const duration = lodash.get(response, ['data', 'paths', '0', 'duration']);
        if (duration) {
          return duration / 60 + 20;
        } else {
          return 30;
        }
      }
      return 30;
    } else {
      throw new Error('工厂不存在');
    }
  }
}

module.exports = UserService;