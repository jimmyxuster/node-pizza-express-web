'use strict';

const Controller = require('egg').Controller;

module.exports = class BaseController extends Controller {
  success (data) {
    this.ctx.body = {
      ret: 200,
      data
    }
  }
  error (code, msg) {
    this.ctx.body = {
      ret: code,
      msg
    }
  }
  complete (code, data, msg) {
    this.ctx.body = {
      ret: code,
      data,
      msg
    }
  }
}