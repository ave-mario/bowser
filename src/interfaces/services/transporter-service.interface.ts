export interface Transporter {
  sendCode(transpor: string, code: number): void;
  sendLinkToChangePassword(email: string, token: string, name: string): void;
}
