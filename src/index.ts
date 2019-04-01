import { Qiniu } from './Qiniu';

interface IConfig {
  [key: string]: any;
}

export default function lift(config: IConfig) {
  if (!config.qiniu) {
    throw new Error('no qiniu config found');
  }

  if (
    !config.qiniu.baseUrl
    || !config.qiniu.accessKey
    || !config.qiniu.secretKey
    || !config.qiniu.scope
  ) {
    throw new Error('qiniu config need baseUrl, accessKey, secretKey, scope');
  }

  let qiniu = new Qiniu(config.qiniu);

  // @ts-ignore
  this.qiniu = qiniu;
}
