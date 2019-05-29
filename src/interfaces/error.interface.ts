/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export class Error {
  private _code: number;
  private _msg: string;

  constructor(data: { code: number; msg: string }) {
    this._code = data.code;
    this._msg = data.msg;
  }

  get status(): number {
    return this._code;
  }

  get message(): string {
    return this._msg;
  }
}
