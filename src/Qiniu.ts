import qiniu from 'qiniu';

interface IConfig {
  baseUrl: string;
  accessKey: string;
  secretKey: string;
  scope: string;
  zone?: qiniu.conf.Zone;
}

class Qiniu {
  private config: IConfig;

  private putPolicy: qiniu.rs.PutPolicy;

  private token = {
    expiresAt: new Date(0).getTime(),
    value: '',
  };

  constructor(config: IConfig) {
    this.config = config;

    this.config.zone = this.config.zone || qiniu.zone.Zone_z0;

    let options = { scope: this.config.scope };
    this.putPolicy = new qiniu.rs.PutPolicy(options);
  }

  private getToken() {
    if (this.token && this.token.expiresAt > Date.now()) {
      return this.token.value;
    }

    let mac = new qiniu.auth.digest.Mac(this.config.accessKey, this.config.secretKey);
    let uploadToken = this.putPolicy.uploadToken(mac);

    // 默认为1小时失效, 这里设置成半小时失效
    this.token = {
      value: uploadToken,
      // prettier-ignore
      expiresAt: Date.now() + (0.5 * 60 * 60 * 1000),
    };

    return uploadToken;
  }

  private async putBuffer(key: string, buffer: Buffer) {
    return new Promise((resolve, reject) => {
      let uploadToken = this.getToken();
      // 空间对应的机房
      let config = new qiniu.conf.Config({ zone: this.config.zone });
      let formUploader = new qiniu.form_up.FormUploader(config);
      let putExtra = new qiniu.form_up.PutExtra();
      formUploader.put(uploadToken, key, buffer, putExtra, (err: any, body: any, response: any) => {
        if (err) {
          return reject(err);
        }
        if (response.statusCode === 200) {
          resolve(body);
        } else {
          // eslint-disable-next-line no-console
          console.warn('qiniu putBuffer error', response.statusCode, body);
          reject(
            new Error(`
              statusCode: ${response.statusCode}
              body: ${body}`)
          );
        }

        return null;
      });
    });
  }

  public async uploadBuffer(key: string, buffer: Buffer) {
    await this.putBuffer(key, buffer);
    return `${this.config.baseUrl}/${key}`;
  }
}

export { Qiniu };
