import nodemailer from 'nodemailer';
import logger from 'js-logger';
import { config } from '../config/environment';

export async function emailSend(
  email: string,
  content: string,
  subject: string
): Promise<void | boolean> {
  if (config.app.environment !== 'test') {
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
        logger.error(error);
      } else {
        logger.info('Server is ready to take messages');
      }
    });

    let HelperOptions = {
      from: `Hotel ave-mario.@gmail.com`,
      to: email,
      subject,
      html: content
    };
    let info = await transporter.sendMail(HelperOptions);
    logger.info('sendEmail: ' + email);
    logger.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
