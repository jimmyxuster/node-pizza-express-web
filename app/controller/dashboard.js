const BaseController = require('./base');

class DashboardController extends BaseController {
  async platformData() {
    const result = await this.ctx.service.dashboard.platform();
    if (result) {
      this.success(result);
    } else {
      this.error(1000, '获取平台统计数据失败，请稍后再试');
    }
  }
  async latestIncome() {
    const result = await this.ctx.service.dashboard.getLatestIncome();
    if (result) {
      this.success(result);
    } else {
      this.error(1000, '获取平台近日收入金额失败，请稍后再试');
    }
  }

  async orderAmountRange() {
    const result = await this.ctx.service.dashboard.getOrderAmountRange();
    if (result) {
      this.success(result);
    } else {
      this.error(1000, '获取平台订单金额分布失败，请稍后再试');
    }
  }

  async getLatestUserGrowth() {
    const result = await this.ctx.service.dashboard.getLatestUserGrowth();
    if (result) {
      this.success(result);
    } else {
      this.error(1000, '获取平台近日用户增长数失败，请稍后再试');
    }
  }
}

module.exports = DashboardController;
