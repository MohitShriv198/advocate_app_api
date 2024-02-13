import { Module,Global } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import {HttpResponse} from '../httpResponse'; 

@Global()
@Module({
  providers: [TwilioService,HttpResponse],
  exports: [TwilioService],
})
export class TwilioModule {}
