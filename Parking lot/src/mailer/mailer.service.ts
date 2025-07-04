import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    auth: {
      user: '5629ae5285eadd',
      pass: 'de57450a04ed27',
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: '"Parking App" <no-reply@parking.com>',
      to,
      subject,
      text,
    });
  }
}
