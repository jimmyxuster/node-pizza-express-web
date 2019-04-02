const Service = require('egg').Service;

const SELECT_MENU_SQL = 'SELECT * FROM `food` join `foodcategory` on food.categoryId = foodcategory.id'

class MenuService extends Service {
  getMenu() {
    return this.app.mysql.query(SELECT_MENU_SQL);  
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