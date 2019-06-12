import { Transporter } from '../interfaces';

export class Transport {
  private _transporter: Transporter;

  public constructor(transporter: Transporter) {
    this._transporter = transporter;
  }

  public sendCode(email: string, code: number) {
    this._transporter.sendCode(email, code);
  }

  public sendLinkToChangePassword(email: string, token: string, name: string) {
    this._transporter.sendLinkToChangePassword(email, token, name);
  }
}
