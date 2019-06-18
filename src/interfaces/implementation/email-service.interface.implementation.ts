import { ITransporter } from '../services';
import { emailSend, config } from '../../config';
import { EmailMessages } from '../../enums';

export class EmailService implements ITransporter {
  public sendCode(email: string, code: number) {
    const content = EmailMessages.code.content + code;
    emailSend(email, content, EmailMessages.code.subject);
  }

  public sendLinkToChangePassword(
    originLink: string,
    email: string,
    token: string,
    name: string
  ) {
    const link = `${originLink}/welcome?token=${token}&name=${name}`;
    const content = EmailMessages.linkChangePassword.content + link;
    emailSend(email, content, EmailMessages.linkChangePassword.subject);
  }
}
