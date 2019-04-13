const BaseController = require('./base');

class DashboardController extends BaseController {
  async platformData() {
    this.ctx.body = await this.ctx.service.dashboard.platform();
  }
}

module.exports = DashboardController;
