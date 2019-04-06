const Service = require('egg').Service;
const COS = require('cos-nodejs-sdk-v5');
const crypto = require('crypto');
const fs = require('fs-extra');
const { promisify } = require('util');
const cos = new COS({
  SecretId: 'AKID4vXu1sfeIitoTsCsWw6zbx3sRmvobqzs',
  SecretKey: 'nLm11oMfiW4PYS5SZQ0KSM0PZU9YijY8'
});
const Bucket = 'pizza-express-app-1252752952';
const Region = 'ap-shanghai';
cos.sliceUploadFile = promisify(cos.sliceUploadFile);

async function getFileMd5(resDir) {
  const stat = await fs.stat(resDir);
  if (stat && stat.isFile()) {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(resDir);
      const fsHash = crypto.createHash('md5');

      stream.on('data', function(d) {
        fsHash.update(d);
      });
      stream.on('error', function (e) {
        reject(e);
      });

      stream.on('end', function() {
        const md5 = fsHash.digest('hex');
        resolve(md5);
      });
    })
  } else {
    throw new Error('File not exist');
  }
}

class UploadService extends Service {
  async upload(file) {
    const { filepath: resDir, mime: type } = file;
    let key = await getFileMd5(resDir);
    if (type) {
      key = key + '.' + type.substring(type.indexOf('/') + 1, type.length);
    }
    await cos.putObject({
      Bucket,
      Region,
      Key: key,
      Body: fs.createReadStream(resDir),
      ContentType: type || 'application/octet-stream',
    });
    return `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`;
  }
}

module.exports = UploadService;
