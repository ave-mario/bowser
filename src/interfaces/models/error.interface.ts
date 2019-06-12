export class Error {
  private _code: number;
  private _msg: string;

  public constructor(data: { code: number; msg: string }) {
    this._code = data.code;
    this._msg = data.msg;
  }

  public get status(): number {
    return this._code;
  }

  public get message(): string {
    return this._msg;
  }
}
