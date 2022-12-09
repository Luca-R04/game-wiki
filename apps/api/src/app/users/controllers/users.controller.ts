/* eslint-disable @typescript-eslint/no-empty-function */
import { Body, Controller, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { JWT_SECRET } from '../../../constants';
import { User } from 'shared/user';
import { UsersRepository } from '../repositories/users.repository';
import * as jwt from 'jsonwebtoken';
import { Game } from 'shared/game';

@Controller('user')
export class UsersController {
  constructor(private userDB: UsersRepository) {}

  @Get()
  async findUser(@Headers('authorization') authJwtToken): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.findUser(user.email);
  }

  @Get(':userId')
  async findById(@Param('userId') userId: string): Promise<User> {
    return this.userDB.findById(userId);
  }

  @Put()
  async addFriend(
    @Headers('authorization') authJwtToken,
    @Body('friendId') friendId: string,
  ): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    const friend = await this.userDB.findById(friendId);
    return this.userDB.addFriend(user.email, friend);
  }

  @Put('/game')
  async addGame(
    @Headers('authorization') authJwtToken,
    @Body() game: Game,
  ): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.addGame(user.email, game);
  }
}
