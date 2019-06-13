export interface Transporter {
  sendCode(transpor: string, code: number): void;
  sendLinkToChangePassword(
    originLink: string | string[],
    email: string,
    token: string,
    name: string
  ): void;
}
