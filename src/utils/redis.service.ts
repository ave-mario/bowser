import { ISaver } from '../interfaces';
import { ClientRedis } from '../enums';
export default class Cash {
  private _saver: ISaver;

  public constructor(saver: ISaver) {
    this._saver = saver;
  }

  public saveCode(phone: string, code: number) {
    this._saver.setHmset(ClientRedis.LoginCode, phone, code.toString());
  }

  public getCode(phone: string): string {
    return this._saver.getHmsetValue(ClientRedis.LoginCode, phone);
  }

  public deleteCode(phone: string): void {
    this._saver.deleteHsetValue(ClientRedis.LoginCode, phone);
  }
}
