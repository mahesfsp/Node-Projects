import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 587,
      auth: {
        user: '5629ae5285eadd',   // ✅ Replace with your Mailtrap user
        pass: 'de57450a04ed27',   // ✅ Replace with your Mailtrap password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: '"Library System" <no-reply@library.com>',
      to,
      subject,
      text,
    });
  }
}
