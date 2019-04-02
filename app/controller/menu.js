const BaseController = require('./base');

class MenuController extends BaseController {
  async index () {
    try {
      const menu = await this.ctx.service.menu.getMenu(this.ctx.request.query);
      this.success(menu);
    } catch (e) {
      console.error(e);
      this.error('获取菜单失败');
    }
  }
  async create() {
    try {
      await this.ctx.service.menu.createMenu(this.ctx.request.body);
      this.success();
    } catch (e) {
      this.error('创建菜单项失败');
    }
  }
  async update() {
    try {
      await this.ctx.service.menu.updateMenu(this.ctx.request.body);
      this.success();
    } catch (e) {
      this.error('更新菜单项失败');
    }
  }
  async destroy() {
    try {
      await this.ctx.service.menu.deleteMenu(this.ctx.request.body);
      this.success();
    } catch (e) {
      this.error(`更新菜单项失败：${e.message}`);
    }
  }
}

module.exports = MenuController;