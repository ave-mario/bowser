import nodemailer from 'nodemailer';
import { config } from '../config/environment';
import logger from '../config/winston';

export async function emailSend(
  email: string,
  content: string,
  subject: string
): Promise<void | boolean> {
  if (config.app.environment !== 'test') {
    let transporter = nodemailer.createTransport({
      host: config.email.host,
      port: 465,
      secure: true,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });

    transporter.verify((error: Error, success: any) => {
      if (error) {
        logger.warn(error);
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
