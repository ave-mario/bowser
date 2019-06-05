import { emailSend } from '../config';
import { EmailMessages } from '../enums';

export class EmailService {
  public static sendCode(email: string, code: number, callback: () => void) {
    const content = EmailMessages.code.content + code;
    emailSend(email, content, EmailMessages.code.subject)
      .then(() => {
        callback();
      })
      .catch(err => {
        throw new Error(err);
      });
  }
}
