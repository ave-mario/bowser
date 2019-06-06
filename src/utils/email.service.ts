import { emailSend, config } from '../config';
import { EmailMessages } from '../enums';

export class EmailService {
  public static sendCode(email: string, code: number) {
    const content = EmailMessages.code.content + code;
    emailSend(email, content, EmailMessages.code.subject);
  }

  public static sendLinkToChangePassword(email: string, token: string) {
    const link = config.clients.stuffLink + `?token=${token}`;
    const content = EmailMessages.linkChangePasswrod.content + link;
    emailSend(email, content, EmailMessages.linkChangePasswrod.subject);
  }
}
