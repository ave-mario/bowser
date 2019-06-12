import { Transporter } from '../services';
import { emailSend, config } from '../../config';
import { EmailMessages } from '../../enums';

export class EmailService implements Transporter {
  public sendCode(email: string, code: number) {
    const content = EmailMessages.code.content + code;
    emailSend(email, content, EmailMessages.code.subject);
  }

  public sendLinkToChangePassword(email: string, token: string, name: string) {
    const link = config.clients.stuffLink + `welcome?toke=${token}&name=${name}`;
    const content = EmailMessages.linkChangePasswrod.content + link;
    emailSend(email, content, EmailMessages.linkChangePasswrod.subject);
  }
}
