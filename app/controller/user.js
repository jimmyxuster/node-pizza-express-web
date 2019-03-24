'use strict';

const BaseController = require('./base');

class UserController extends BaseController {
  async update() {
    const { ctx } = this;
    try {
      const result = await ctx.service.user.update(ctx.request.body);
      if (result === true) {
        this.success();
      } else {
        this.error(1002, '更新用户信息失败，数据库连接异常')
      }
    } catch (e) {
      this.error(1001, e.message || '更新用户信息失败');
    }
  }
}

module.exports = UserController;