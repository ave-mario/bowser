import { ISaver } from '../interfaces';
export default class Cash {
  private _saver: ISaver;

  public constructor(saver: ISaver) {
    this._saver = saver;
  }

  public saveCode(phone: string, code: number) {
    this._saver.setValue(phone, code.toString(), 300);
  }

  public getCode(phone: string): string {
    return this._saver.getValue(phone);
  }

  public deleteCode(phone: string): void {
    this._saver.deleteValue(phone);
  }
}
