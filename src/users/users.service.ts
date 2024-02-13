import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { User } from './user.entity';
import { Not, Repository } from 'typeorm';
import { TwilioService } from 'src/twilio/twilio.service';
import { EmailService } from 'src/email/email.service';
import { HttpResponse } from 'src/httpResponse';
import {
  OTP_NOT_VALID,
  OTP_VERIFY,
  PHONE_ALREADY_USED,
  SIGN_OUT_SUCCESS,
  TWILIO_FORGOT_PASSWORD_MSG,
  TWILIO_OTP_MSG,
  UPDATE_SUCCESS,
  USER_CREATED,
  USER_NOT_FOUND,
} from 'src/utils/constant';
import { promisify } from 'util';
// import { FcmNotificationService } from 'src/fcm-notification/fcm-notification.service';
import { UpdateUserDto } from './dtos/update-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private twilioService: TwilioService,
    private emailService: EmailService,
    private httpResponse: HttpResponse,
    // private fcmNotificationService: FcmNotificationService,
  ) {}

  async create(
    name: string,
    email: string,
    password: string,
    deviceId: string,
    deviceToken: string,
    deviceType: string,
  ) {
    try {
      const user = this.userRepository.create({
        name,
        email,
        password,
        deviceId,
        deviceToken,
        deviceType,
      });
      const userInfo = await this.userRepository.save(user);
      return this.httpResponse.success(userInfo, USER_CREATED);
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async update(id: number, body: UpdateUserDto) {
    try {
      const user = await this.userRepository.update(id, body);
      return this.httpResponse.success(user, UPDATE_SUCCESS);
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async sentOtp(phone_number: string, otp: string, userId: number) {
    try {
      const user = await this.userRepository.findOneBy({
        phone_number,
      });
      if (user) {
        return this.httpResponse.badRequest({}, PHONE_ALREADY_USED);
      }
      await this.userRepository.update(userId, {
        phone_number,
        otp,
      });
      // Send OTP message using Twilio service
      return this.twilioService.sendOtpMessage(
        phone_number,
        TWILIO_OTP_MSG + otp,
      );
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async updatePhoneOtp(phone_number: string, otp: string) {
    try {
      let user = await this.userRepository.findOneBy({
        phone_number,
      });

      if (!user) {
        return this.httpResponse.notFound({}, USER_NOT_FOUND);
      }

      user.otp = otp;
      await this.userRepository.save(user);
      return this.twilioService.sendOtpMessage(
        phone_number,
        TWILIO_OTP_MSG + otp,
      );
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async updateEmailOtp(email: string, otp: string) {
    try {
      const user = await this.findEmail(email);

      if (!user) {
        return this.httpResponse.notFound({}, USER_NOT_FOUND);
      }

      user.otp = otp;
      await this.userRepository.save(user);
      return this.emailService.sendOtp({
        name: user.name,
        email: user.email,
        otp: otp,
      });
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  findEmail(email: string) {
    return this.userRepository.findOneBy({
      email: email,
    });
  }

  findPhone(phone_number: string) {
    return this.userRepository.findOneBy({
      phone_number: phone_number,
    });
  }

  async verifyPhoneOtp(phone_number: string, otp: string) {
    try {
      let user = await this.userRepository.findOneBy({
        phone_number,
      });

      if (!user) {
        return this.httpResponse.notFound({}, USER_NOT_FOUND);
      }
      if (user.otp !== otp) {
        return this.httpResponse.badRequest({}, OTP_NOT_VALID);
      }
      return this.httpResponse.success(user, OTP_VERIFY);
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async verifyEmailOtp(email: string, otp: string) {
    try {
      let user = await this.findEmail(email);
      if (!user) {
        return this.httpResponse.notFound({}, USER_NOT_FOUND);
      }
      if (user.otp !== otp) {
        return this.httpResponse.badRequest({}, OTP_NOT_VALID);
      }
      return this.httpResponse.success(user, OTP_VERIFY);
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async forgotPasswordPhone(phone_number: string, pwd: string) {
    try {
      let user = await this.userRepository.findOneBy({
        phone_number,
      });
      if (!user) {
        return this.httpResponse.notFound({}, USER_NOT_FOUND);
      }
      // Hash the user's password
      // Generate a salt
      const salt = randomBytes(8).toString('hex');

      // Hash the salt and the password together
      const hash = (await scrypt(pwd, salt, 32)) as Buffer;

      // Join the hashed result and the salt together
      const result = salt + '.' + hash.toString('hex');
      await this.userRepository.update(user.id, { password: result });
      return this.twilioService.sendTemporaryPassword(
        phone_number,
        TWILIO_FORGOT_PASSWORD_MSG + pwd,
      );
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async forgotPasswordEmail(email: string, pwd: string) {
    try {
      let user = await this.findEmail(email);
      if (!user) {
        return this.httpResponse.notFound({}, USER_NOT_FOUND);
      }
      // Hash the user's password
      // Generate a salt
      const salt = randomBytes(8).toString('hex');

      // Hash the salt and the password together
      const hash = (await scrypt(pwd, salt, 32)) as Buffer;

      // Join the hashed result and the salt together
      const result = salt + '.' + hash.toString('hex');
      await this.userRepository.update(user.id, { password: result });

      return this.emailService.sendTemporaryPassword({
        name: user.name,
        email: user.email,
        pwd: pwd,
      });
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async changeDevice(
    email: string,
    deviceId: string,
    deviceToken: string,
    deviceType: string,
  ) {
    try {
      let user = await this.findEmail(email);
      if (!user) {
        return this.httpResponse.notFound({}, USER_NOT_FOUND);
      }
      // await this.fcmNotificationService.sendingNotification(
      //   user.deviceToken,
      //   {
      //     title: 'Sign Out',
      //     body: 'You sign in with different device',
      //   },
      //   {},
      // );
      await this.userRepository.update(email, {
        deviceId,
        deviceToken,
        deviceType,
      });
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  signOut(userId: number) {
    try {
      this.userRepository.update(userId, { isLoggedIn: false });
      return this.httpResponse.success({}, SIGN_OUT_SUCCESS);
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  async updateIsLoggedin(
    userId: number,
    deviceId: string,
    deviceToken: string,
    deviceType: string,
  ) {
    await this.userRepository.update(userId, {
      deviceId,
      deviceToken,
      deviceType,
      isLoggedIn: true,
    });
  }
}
