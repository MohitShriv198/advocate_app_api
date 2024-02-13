import { Body, Controller, Post, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SendOtpDto } from './dtos/send-otp.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { EmailService } from './../email/email.service';
import { SignupDto } from './dtos/singup.dto';
import { TwilioService } from './../twilio/twilio.service';
import { VerfiyAccountDto } from './dtos/verfiy-account.dto';
import { ChangeDevice } from './dtos/change-device.dto';
import { SignOutDto } from './dtos/signout.dto';
import { SigninDto } from './dtos/signin.dto';

// import { FcmNotificationService } from '../fcm-notification/fcm-notification.service';
// import { CometchatService } from 'src/cometchat/cometchat.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private twilioService: TwilioService,
    // private readonly sendingNotificationService: FcmNotificationService,
    // private readonly cometchatService:CometchatService
  ) {}

  @Post('/signup')
  createUser(@Body() body: SignupDto) {
    return this.authService.signUp(
      body.name,
      body.email,
      body.password,
      body.deviceId,
      body.deviceToken,
      body.deviceType,
    );
  }

  @Post('/signin')
  signIn(@Body() body: SigninDto) {
    return this.authService.signIn(
      body.email,
      body.password,
      body.deviceId,
      body.deviceToken,
      body.deviceType,
    );
  }

  @Post('/signout')
  signOut(@Body() body: SignOutDto) {
    return this.authService.signOut(body.userId);
  }

  @Post('/sendOtp')
  sendOtp(@Body() body: SendOtpDto) {
    return this.authService.sendOtp(body.phone_number, body.userId);
  }

  @Post('/verifyAccount')
  verifyAccount(@Body() body: VerfiyAccountDto) {
    return this.authService.verifyAccount(body.phone_number, body.email);
  }

  @Post('/forgotPassword')
  forgotPassword(@Body() body: VerfiyAccountDto) {
    return this.authService.forgotPassword(body.phone_number, body.email);
  }

  @Post('/verifyOtp')
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body.phone_number, body.email, body.otp);
  }

  @Patch('/changeDevice')
  changeDevice(@Body() body: ChangeDevice) {
    return this.authService.changeDevice(
      body.email,
      body.deviceId,
      body.deviceToken,
      body.deviceType,
    );
  }

  @Get('/test')
  async test() {
    //return this.twilioService.sendMessage(process.env.TEST_PHONE_NUMBER, 'hii');
    /*const token = Math.floor(1000 + Math.random() * 9000).toString();
    return await this.emailService.sendUserWelcome(
      { username: 'hiiii', email: 'neeraj.singh@evontech.com' },
      token,
    );*/

    /*return await this.sendingNotificationService.sendingNotification(
      'dgeKzDWowDTy7bf4iTQKW_:APA91bGWZ6OYpp2NZe8wT0xPlofbVLs6Sv766L3cXSZvLdLVNP1E5DrSRwENrUCxaGvRpPXekXmI4IIqFlJe74ZFMWgyPf2vFXez838nBk9YFUgrKzgjmlLUxWDA_-3S8QunDWrPcrxi',
      {
        title: 'Hi there this is title1',
        body: 'Hi there this is message1',
      },
      {
        name: 'Joe',
        age: '21',
      },
    );*/

    // return this.cometchatService.createUser(
    //   {
    //     "uid": "Prabhat2",
    //     "name": "Prabhat Bhardwaj",
    //     "avatar":"https://lh3.googleusercontent.com/-gR-RLqmxTm8/AAAAAAAAAAI/AAAAAAAAAAA/AFNEGgIPVBNexP4QwpZXrukQWOVdMjkApA/photo.jpg?sz=46",
    //     "metadata": {
    //         "@private":{
    //             "email": "string",
    //             "contactNumber": "string"
    //         },
    //     }
    //  }
    // );
    
  }
}