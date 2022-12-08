/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Headers } from '@nestjs/common';
import { JWT_SECRET } from '../../../constants';
import { User } from 'shared/user';
import { UserRepository } from '../repositories/users.repository';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
  constructor(private userDB: UserRepository) {}

  @Get()
  async findUser(@Headers('authorization') authJwtToken): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.findUser(user.email);
  }
}
