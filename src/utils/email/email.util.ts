import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailUtil {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template, // e.g., './verification-code'
      context, // e.g., { code: '123456' }
    });
  }
}
