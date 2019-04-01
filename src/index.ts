import { Qiniu, IConfig } from './Qiniu';

async function lift(this: { config: { qiniu: IConfig }; qiniu?: Qiniu }) {
  if (!this.config.qiniu) {
    throw new Error('no qiniu config found');
  }

  if (
    !this.config.qiniu.baseUrl
    || !this.config.qiniu.accessKey
    || !this.config.qiniu.secretKey
    || !this.config.qiniu.scope
  ) {
    throw new Error('qiniu config need baseUrl, accessKey, secretKey, scope');
  }

  let qiniu = new Qiniu(this.config.qiniu);
  this.qiniu = qiniu;
  return qiniu;
}

export { lift };
export default lift;
