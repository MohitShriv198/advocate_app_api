import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { HttpResponse } from 'src/httpResponse';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private httpResponse: HttpResponse,
  ) {}

  async sendUserWelcome(user: any, token: string) {
    const confirmation_url = `example.com/auth/confirm?token=${token}`;

    return this.httpResponse.success(
      await this.mailerService.sendMail({
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: 'Welcome to Genie Calculator App! Confirm your Email',
        template: './welcome',
        context: {
          name: user.username,
          confirmation_url,
          appname: process.env.APP_NAME,
        },
      }),
      'Email sent successfully',
    );
  }

  async sendOtp(user: any) {
    return this.httpResponse.success(
      await this.mailerService.sendMail({
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: 'Genie Calculator - Your OTP for Verification',
        template: './otp',
        context: {
          name: user.name,
          otp: user.otp,
          appname: process.env.APP_NAME,
        },
      }),
      'Email sent successfully',
    );
  }

  async sendTemporaryPassword(user: any) {
    return this.httpResponse.success(
      await this.mailerService.sendMail({
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: 'Genie Calculator App - Temporary Password',
        template: './temporary-password',
        context: {
          name: user.name,
          pwd: user.pwd,
          appname: process.env.APP_NAME,
        },
      }),
      'Email sent successfully',
    );
  }
}
