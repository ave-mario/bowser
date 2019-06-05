import nodemailer from 'nodemailer';
import { config } from '../config/environment';

export async function emailSend(
  email: string,
  content: string,
  subject: string
): Promise<void> {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: config.email.host,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  transporter.verify((error: Error, success: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take messages');
    }
  });

  let HelperOptions = {
    from: `Hotel ave-mario.@gmail.com`,
    to: email,
    subject,
    html: content
  };
  let info = await transporter.sendMail(HelperOptions);
  console.log('sendEmail: ' + email);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
