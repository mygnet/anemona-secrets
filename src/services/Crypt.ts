/* eslint-disable curly */
import Core from './Core';
import { createHash, createCipheriv, randomBytes, createDecipheriv } from "crypto";

const uid = ['6CFBD07E', '3737', '4D2B', 'BC9C', '1B0648ADAC21'];
const algorithm = ['aes', '256', 'cbc'];

export default class Crypt {

  public static me?: Crypt;

  constructor(private core: Core) { }

  public static self(core?: Core, cmd?: [string], req?: any) {
    if (!Crypt.me) Crypt.me = core ? new Crypt(core) : undefined;
    if (Crypt.me && cmd) Crypt.me.router(cmd, req);
    return Crypt.me;
  }

  public static md5(data: string) {
    return createHash('md5').update(data).digest("hex");
  }

  public static b64Encode(data: string) {
    const buff = Buffer.from(data, 'utf-8');
    return buff.toString('base64');
  }

  public static b64Decode(data: string) {
    const buff = Buffer.from(data, 'base64');
    return buff.toString('utf-8');
  }

  public static encode(text: string, key: string) {
    key = Crypt.md5(Core.id + key + uid.join('-'));
    const _iv = randomBytes(32).toString('base64').substring(0, 13);
    let iv = Buffer.from(Crypt.md5(_iv), 'hex');
    let cipher = createCipheriv(algorithm.join('-'), Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return _iv + encrypted.toString('base64');
  }

  public static decode(text: string, key: string) {
    key = Crypt.md5(Core.id + key + uid.join('-'));
    let iv = Buffer.from(Crypt.md5(text.substring(0, 13)), 'hex');
    let encryptedText = Buffer.from(text.substring(13), 'base64');
    let decipher = createDecipheriv(algorithm.join('-'), Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  public async router(cmd: [string], req?: any) {
    switch (cmd.shift()) {
      case 'encode': return this.getEncode(req);
      case 'decode': return this.getDecode(req);
    }
  }

  public async getDecode(req: any) {
    const rd = req.content;
    let res = Crypt.decode(rd.data, rd.key);
    if (rd.json) res = JSON.parse(res);
    this.core.postCmd(req.command, res);
  }

  public async getEncode(req: any) {
    const rd = req.content;
    let res = Crypt.encode(rd.data, rd.key);
    if (rd.json) res = JSON.parse(res);
    this.core.postCmd(req.command, res);
  }

}