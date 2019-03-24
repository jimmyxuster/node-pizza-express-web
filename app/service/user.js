const Service = require('egg').Service;

class UserService extends Service {
  async update(user) {
    if (typeof user.id !== 'undefined') {
      user.id = +user.id;
      const result = await this.app.mysql.update('user', user);
      return result.affectedRows === 1;
    } else {
      throw new Error('更新失败，缺少用户id');
    }
  }
}

module.exports = UserService;