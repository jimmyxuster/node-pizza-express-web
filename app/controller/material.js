const BaseController = require('./base');

class MaterialController extends BaseController {
  async updateStorage() {
    const { factoryId, storage } = this.ctx.request.query;
    try {
      await this.service.material.updateStorage(factoryId, storage);
      this.success();
    } catch (e) {
      this.ctx.logger.error(e);
      this.error(1000, '更新库存失败');
    }
  }

  async materialCategory() {
    try {
      this.success(await this.service.material.getMaterialCategories());
    } catch (e) {
      this.ctx.logger.error(e);
      this.error(1000, '获取原料种类失败');
    }
  }

  async foodMaterials() {
    try {
      this.success(await this.service.material.getFoodMaterials(this.ctx.params.foodId));
    } catch (e) {
      this.ctx.logger.error(e);
      this.error(1000, '获取关联原料失败');
    }
  }
}

module.exports = MaterialController;
