const Service = require('egg').Service;

class MaterialService extends Service {
  async updateStorage(factoryId, storage) {
    if (!Array.isArray(storage)) {
      storage = [storage];
    }
    await this.app.mysql.updateRows('material', storage.map(item => ({
      row: {amount: item.amount},
      where: {name: item.name, factoryId},
    })));
  }

  getMaterialCategories() {
    return this.app.mysql.query('SELECT distinct(name) FROM `material`');
  }

  getFoodMaterials(foodId) {
    return this.app.mysql.select('foodmaterial', {
      where: {foodId},
      columns: ['materialName', 'amount'],
    });
  }
}

module.exports = MaterialService;
