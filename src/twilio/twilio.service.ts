import { Injectable } from '@nestjs/common';
import TwilioClient from 'twilio/lib/rest/Twilio';
import * as Twilio from 'twilio';
import { HttpResponse } from 'src/httpResponse';
import { ConfigService } from '@nestjs/config';
import { OTP_SENT_TO_PHONE, PWD_SENT_TO_PHONE } from 'src/utils/constant';

@Injectable()
export class TwilioService {
  client: TwilioClient;
  config: ConfigService;

  constructor(
    private httpResponse: HttpResponse,
    private configService: ConfigService,
  ) {
    this.client = Twilio(
      configService.get('TWILIO_ACCOUNT_SID'),
      configService.get('TWILIO_AUTH_TOKEN'),
    );
    this.config = configService;
  }
  async sendOtpMessage(toNumber: string, message: string) {
    try {
      await this.client.messages.create({
        body: message,
        from: this.config.get('TWILIO_FROM_NUMBER'),
        to: toNumber,
      });
      return this.httpResponse.success({}, OTP_SENT_TO_PHONE);
    } catch (e) {
      return this.httpResponse.serverError({}, e.message);
    }
  }

  async sendTemporaryPassword(toNumber: string, message: string) {
    try {
      await this.client.messages.create({
        body: message,
        from: this.config.get('TWILIO_FROM_NUMBER'),
        to: toNumber,
      });
      return this.httpResponse.success({}, PWD_SENT_TO_PHONE);
    } catch (e) {
      return this.httpResponse.serverError({}, e.message);
    }
  }
}
