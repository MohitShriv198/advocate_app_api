import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LOGIN_SUCCESS } from 'src/utils/constant';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { HttpResponse } from 'src/httpResponse';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthAdminService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private usersService: UsersService,
        private jwtService: JwtService,
        private httpResponse: HttpResponse,
    ) { }

    async signIn(email: string, password: string) {
        try {
            const user = await this.usersService.findEmail(email);
            if (!user) {
                throw new NotFoundException('Admin user not found');
            } else {
                if (user.role == 'admin') {
                    const [salt, storedHash] = user.password.split('.');
                    const hash = (await scrypt(password, salt, 32)) as Buffer;
                    if (storedHash !== hash.toString('hex')) {
                        throw new NotFoundException('Incorrect password');
                    }
                    const payload = { sub: user.id, id: user.id };
                    return {
                        code: LOGIN_SUCCESS,
                        status: 'success',
                        message: 'Login successfull',
                        data: {
                            user: user,
                            api_token: await this.jwtService.signAsync(payload),
                        },
                    };
                } else {
                    throw new NotFoundException('This user is not an Admin');
                }
            }
        } catch (error) {
            return {
                code: error.response ? error.response.statusCode : undefined,
                status: 'error',
                message: error.message,
                data: null,
            };
        }
    }

    async changePassword(email: string, currentPassword: string, newPassword: string) {
        try {
            const user = await this.usersService.findEmail(email);
            if (!user) {
                throw new NotFoundException('Admin user not found');
            }
            const [salt, storedHash] = user.password.split('.');
            const hash = (await scrypt(currentPassword, salt, 32)) as Buffer;
            if (storedHash !== hash.toString('hex')) {
                throw new BadRequestException('Incorrect current password');
            }
            if (user.role == 'admin') {
                const _salt = randomBytes(8).toString('hex');
                const _hash = (await scrypt(newPassword, _salt, 32)) as Buffer;
                const result = _salt + '.' + _hash.toString('hex');
                user.password = result;
                await this.userRepository.save(user);
                return this.httpResponse.success({}, "Password changed successfully!")
            } else {
                throw new NotFoundException("The user is not an admin.")
            }
        } catch (error) {
            return {
                code: error.response ? error.response.statusCode : undefined,
                status: 'error',
                message: error.message,
                data: null,
            };
        }
    }
}
