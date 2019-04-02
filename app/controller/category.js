const BaseController = require('./base');

class CategoryController extends BaseController {
  async index() {
    try {
      const categories = await this.ctx.service.menu.getCategories();
      this.success(categories)
    } catch (e) {
      console.error(e);
      this.error('获取菜单分类失败');
    }
  }
  async create() {
    try {
      await this.ctx.service.menu.createCategory(this.ctx.request.body);
      this.success();
    } catch (e) {
      this.error('创建菜单分类失败');
    }
  }
  async update() {
    try {
      await this.ctx.service.menu.updateCategory(this.ctx.request.body);
      this.success();
    } catch (e) {
      this.error('更新菜单分类失败');
    }
  }
  async destroy() {
    try {
      await this.ctx.service.menu.deleteCategory(this.ctx.request.body);
      this.success();
    } catch (e) {
      this.error(`更新菜单分类失败：${e.message}`);
    }
  }
}

module.exports = CategoryController;