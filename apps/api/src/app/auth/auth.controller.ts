/* eslint-disable @typescript-eslint/no-empty-function */
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as password from 'password-hash-and-salt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../constants';
import { User } from 'shared/user';

@Controller()
export class AuthController {
  constructor(private userDB: AuthRepository) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') plainpassword: string
  ) {
    const user = await this.userDB.findUser(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return new Promise((resolve, reject) => {
      password(plainpassword).verifyAgainst(user.password, (err, verified) => {
        if (!verified) {
          reject(new UnauthorizedException());
        }

        const authJwtToken = jwt.sign({ email }, JWT_SECRET);
        resolve({ authJwtToken });
      });
    });
  }

  @Post('register')
  async register(@Body() user: User) {
    if (user._id) {
      throw new BadRequestException("Can't set user id");
    }

    const hashedPassword = await new Promise<string>((resolve, reject) => {
      password(user.password).hash((error, hash) => {
        if (error) {
          reject(new Error('Password hash failed.'));
        } else {
          resolve(hash);
        }
      });
    });
  
    user.password = hashedPassword;
    
    return this.userDB.createUser(user);
  }
}
