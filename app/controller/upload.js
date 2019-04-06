const BaseController = require('./base');

class UploadController extends BaseController {
  async upload() {
    const files = this.ctx.request.files || {};
    const keys = Object.keys(files);
    const pathRes = new Array(keys.length);
    try {
      const jobs = keys.map((key, index) => (async () => {
        const file = files[key];
        pathRes[index] = await this.ctx.service.upload.upload(file);
        if (pathRes.length === keys.length) {
          this.success(pathRes);
        }
      })());
      await Promise.all(jobs);
    } catch (e) {
      this.error(2, e.message || '服务端异常');
    }
  }
}

module.exports = UploadController;