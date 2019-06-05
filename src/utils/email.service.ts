import { emailSend } from '../config';
import { EmailMessages } from '../enums';

export class EmailService {
  public static sendCode(email: string, code: number) {
    const content = EmailMessages.code.content + code;
    emailSend(email, content, EmailMessages.code.subject).catch(err => {
      throw new Error(err);
    });
  }
}
