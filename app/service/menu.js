const Service = require('egg').Service;

const desiredCols = ['food.id', 'food.name', 'foodcategory.name as categoryName', 'food.description', 'food.createTime', 'price', 'discountPrice', 'amount', 'categoryId', 'image_path', 'month_sales', 'icon_url'];
const BASE_SELECT_MENU_SQL = 'SELECT * FROM `food` join `foodcategory` on food.categoryId = foodcategory.id';
const SELECT_MENU_SQL = BASE_SELECT_MENU_SQL.replace('*', desiredCols.join(','));

class MenuService extends Service {
  async getMenu(query) {
    const { page, pageSize, category, id } = query;
    const queryItems = {
      categoryId: category,
      'food.id': id,
    };
    Object.keys(queryItems).forEach(key => {
      if (queryItems[key] == null) {
        delete queryItems[key];
      }
    });
    const where = this.app.mysql._where(queryItems);
    const limit = this.app.mysql._limit(+pageSize, page * pageSize);
    const data = await this.app.mysql.query(`${SELECT_MENU_SQL}${where}${limit}`);
    const count = await this.app.mysql.query(`${BASE_SELECT_MENU_SQL}${where}`.replace('*', 'count(*) as total'));
    return {
      data,
      total: count[0].total,
    };
  }
  createMenu(body) {
    return this.app.mysql.insert('food', body);
  }
  updateMenu(body) {
    return this.app.mysql.update('food', body);
  }
  deleteMenu(id) {
    return this.app.mysql.delete('food', {id});
  }
  getCategories() {
    return this.app.mysql.select('foodcategory');
  }
  createCategory(body) {
    return this.app.mysql.insert('foodcategory', body);
  }
  updateCategory(body) {
    return this.app.mysql.update('foodcategory', body);
  }
  deleteCategory(id) {
    return this.app.mysql.delete('foodcategory', {id});
  }
}

module.exports = MenuService;