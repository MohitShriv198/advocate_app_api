import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { promisify } from 'util';
import { generateOTPDigit } from 'src/utils/generate-otp';
import { HttpResponse } from 'src/httpResponse';
import {
  SIGN_IN_SUCCESS,
  SIGN_IN_WITH_NEW_DEVICE,
  USER_ALREADY_CREATED,
  USER_NOT_FOUND,
  USER_PASSWORD_INCORRECT,
} from 'src/utils/constant';
import { generateTemporaryPassword } from 'src/utils/generate-password';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private httpResponse: HttpResponse,
  ) {}

  /**
   * Handles user registration by creating a new user account.
   * @param name - The user's name.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @param deviceId - The unique identifier of the user's device.
   * @param deviceToken - The token associated with the user's device for additional security.
   * @param deviceType - The type of the user's device (e.g., 'iOS', 'Android').
   * @returns A Promise that resolves when the user account is successfully created.
   * @throws Throws an error if there is a failure in checking for existing email, hashing the password, or creating the user.
   * @remarks This method checks if the provided email is already in use. If not, it generates a salt, hashes the password
   * with the salt using the scrypt algorithm, and creates a new user with the hashed password. It is designed for user registration.
   */
  async signUp(
    name: string,
    email: string,
    password: string,
    deviceId: string,
    deviceToken: string,
    deviceType: string,
  ) {
    // Check if email is already in use
    const users = await this.usersService.findEmail(email);
    if (users) {
      return this.httpResponse.badRequest({}, USER_ALREADY_CREATED);
    }

    // Hash the user's password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    return await this.usersService.create(
      name,
      email,
      result,
      deviceId,
      deviceToken,
      deviceType,
    );
  }

  /**
   * Handles user authentication by verifying the provided email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @param deviceId - The unique identifier of the user's device.
   * @param deviceToken - The token associated with the user's device for additional security.
   * @param deviceType - The type of the user's device (e.g., 'iOS', 'Android').
   * @returns A Promise that resolves to an authentication token and user information upon successful authentication.
   * @throws Throws an error if there is a failure in finding the user, hashing the password, or updating user login status.
   * @remarks This method checks if the user exists, hashes the provided password, and compares it with the stored hash.
   * If successful, it updates the user's login status and returns an authentication token along with user information.
   * It is designed for user authentication during the sign-in process.
   */
  async signIn(
    email: string,
    password: string,
    deviceId: string,
    deviceToken: string,
    deviceType: string,
  ) {
    try {
      // Find the user by email
      const user = await this.usersService.findEmail(email);

      // Check if user exists
      if (!user) {
        return this.httpResponse.notFound({}, USER_NOT_FOUND);
      }

      // Split stored password into salt and hash
      const [salt, storedHash] = user.password.split('.');

      // Hash the provided password with the stored salt
      const hash = (await scrypt(password, salt, 32)) as Buffer;

      // Compare hashed passwords
      if (storedHash !== hash.toString('hex')) {
        return this.httpResponse.badRequest({}, USER_PASSWORD_INCORRECT);
      }

      // Check for device consistency
      if (user.deviceId !== deviceId && user.isLoggedIn === true) {
        return this.httpResponse.badRequest({}, SIGN_IN_WITH_NEW_DEVICE);
      }

      // Update user's login status and provide authentication token
      await this.usersService.updateIsLoggedin(
        user.id,
        deviceId,
        deviceToken,
        deviceType,
      );
      const payload = { sub: user.id, email: user.email };
      return this.httpResponse.success(
        {
          user: user,
          access_token: await this.jwtService.signAsync(payload),
        },
        SIGN_IN_SUCCESS,
      );
    } catch (error) {
      return this.httpResponse.serverError({}, error.message);
    }
  }

  /**
   * Sends a One-Time Password (OTP) to the specified phone number using Twilio messaging service.
   * @param phone_number - The target phone number to receive the OTP.
   * @param userId - The unique identifier of the user associated with the OTP request.
   * @returns A Promise that resolves when the OTP is successfully sent, and the corresponding user record is updated.
   * @throws Throws an error if there is a failure in generating or sending the OTP, or if updating the user record fails.
   * @remarks This method generates a 4-digit OTP using the generateOTPDigit function, sends the OTP message via Twilio,
   * and updates the user record with the sent OTP. It is designed for securing user authentication processes.
   */
  async sendOtp(phone_number: string, userId: number) {
    // Generate a 4-digit OTP
    let otp = generateOTPDigit(4);

    // Update user record with sent OTP
    return this.usersService.sentOtp(phone_number, otp, userId);
  }

  /**
   * Generates and sends a One-Time Password (OTP) for verifying or updating the user's account.
   * @param phone_number - The user's phone number (optional).
   * @param email - The user's email address.
   * @returns A Promise that resolves when the OTP is successfully generated and sent to the specified contact points.
   * @throws Throws an error if there is a failure in generating or updating the OTPs.
   * @remarks This method generates a 4-digit OTP using the generateOTPDigit function. If a phone number is provided,
   * it updates the phone OTP; otherwise, it updates the email OTP. It is designed for account verification or updating
   * contact information.
   */
  verifyAccount(phone_number: string, email: string) {
    // Generate a 4-digit OTP
    let otp = generateOTPDigit(4);

    // Update phone OTP if phone number is provided
    if (phone_number) {
      return this.usersService.updatePhoneOtp(phone_number, otp);
    }

    // Update email OTP
    return this.usersService.updateEmailOtp(email, otp);
  }

  /**
   * Initiates the password recovery process by generating a temporary password and sending it to the user's contact points.
   * @param phone_number - The user's phone number (optional).
   * @param email - The user's email address.
   * @returns A Promise that resolves when the temporary password is successfully generated and sent.
   * @throws Throws an error if there is a failure in generating or sending the temporary password.
   * @remarks This method generates a temporary password using the generateTemporaryPassword function. If a phone number is
   * provided, it sends the temporary password via phone; otherwise, it sends it via email. It is designed for password recovery.
   */
  forgotPassword(phone_number: string, email: string) {
    // Generate a temporary password
    let pwd = generateTemporaryPassword();

    // Send temporary password via phone if phone number is provided
    if (phone_number) {
      return this.usersService.forgotPasswordPhone(phone_number, pwd);
    }

    // Send temporary password via email
    return this.usersService.forgotPasswordEmail(email, pwd);
  }

  /**
   * Verifies the provided OTP for either phone or email, depending on the available contact information.
   * @param phone_number - The user's phone number (optional).
   * @param email - The user's email address.
   * @param otp - The One-Time Password (OTP) to be verified.
   * @returns A Promise that resolves to true if the OTP is valid; otherwise, resolves to false.
   * @remarks This method verifies the OTP by checking against the stored OTP for either phone or email. It is designed
   * for validating OTPs during account-related operations.
   */
  verifyOtp(phone_number: string, email: string, otp: string) {
    // Verify phone OTP if phone number is provided; otherwise, verify email OTP
    if (phone_number) {
      return this.usersService.verifyPhoneOtp(phone_number, otp);
    }
    return this.usersService.verifyEmailOtp(email, otp);
  }

  /**
   * Changes the associated device for a user.
   * @param deviceId - The unique identifier of the new device.
   * @param email - The user's email address.
   * @returns A Promise that resolves when the device change is successfully recorded.
   * @throws Throws an error if there is a failure in updating the device information.
   * @remarks This method updates the device information for the user, indicating a change in the associated device.
   * It is designed for managing user device associations.
   */
  changeDevice(
    email: string,
    deviceId: string,
    deviceToken: string,
    deviceType: string,
  ) {
    return this.usersService.changeDevice(
      email,
      deviceId,
      deviceToken,
      deviceType,
    );
  }

  signOut(userId: number) {
    return this.usersService.signOut(userId);
  }
}
