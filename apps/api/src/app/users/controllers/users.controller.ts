/* eslint-disable @typescript-eslint/no-empty-function */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JWT_SECRET } from '../../../constants';
import { User } from 'shared/user';
import { UsersRepository } from '../repositories/users.repository';
import * as jwt from 'jsonwebtoken';
import * as password from 'password-hash-and-salt';
import { Game } from 'shared/game';
import { Review } from 'shared/review';
import { GamesRepository } from '../../games/repositories/games.repository';
import { AuthenticationGuard } from '../../guards/authentication.guard';

@Controller('user')
export class UsersController {
  constructor(
    private userDB: UsersRepository,
    private gameDB: GamesRepository
  ) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async findUser(@Headers('authorization') authJwtToken): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.findUser(user.email);
  }

  @Get(':userId')
  async findById(@Param('userId') userId: string): Promise<User> {
    return this.userDB.findById(userId);
  }

  @Put('/update')
  @UseGuards(AuthenticationGuard)
  async updateUser(
    @Headers('authorization') authJwtToken,
    @Body() updatedUser: Partial<User>
  ): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);

    if (updatedUser._id) {
      throw new BadRequestException("Can't update userId");
    } else if (updatedUser.name) {
      throw new BadRequestException("Can't update user name");
    }

    const hashedPassword = await new Promise<string>((resolve, reject) => {
      password(updatedUser.password).hash((error, hash) => {
        if (error) {
          reject(new Error('Password hash failed.'));
        } else {
          resolve(hash);
        }
      });
    });

    updatedUser.password = hashedPassword;

    return this.userDB.updateUser(user, updatedUser);
  }

  @Delete()
  @UseGuards(AuthenticationGuard)
  async deleteUser(@Headers('authorization') authJwtToken) {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    const userId = (await this.userDB.findUser(user.email))._id;

    await this.gameDB.deleteFromUser(userId.toString());

    return this.userDB.deleteUser(userId);
  }

  //Friends
  @Put()
  @UseGuards(AuthenticationGuard)
  async addFriend(
    @Headers('authorization') authJwtToken,
    @Body('friendId') friendId: string
  ): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    const friend = await this.userDB.findById(friendId);
    return this.userDB.addFriend(user.email, friend);
  }

  @Delete('/friend/:friendId')
  @UseGuards(AuthenticationGuard)
  async removeFriend(
    @Headers('authorization') authJwtToken,
    @Param('friendId') friendId: string
  ) {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.removeFriend(user.email, friendId);
  }

  //Games
  @Put('/game')
  @UseGuards(AuthenticationGuard)
  async addGame(
    @Headers('authorization') authJwtToken,
    @Body() game: Game
  ): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.addGame(user.email, game);
  }

  @Put('/game/:gameId')
  @UseGuards(AuthenticationGuard)
  async updateGame(
    @Headers('authorization') authJwtToken,
    @Param('gameId') gameId: string,
    @Body() updatedGame: Partial<Game>
  ): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.updateGame(user.email, gameId, updatedGame);
  }

  @Delete('/game/:gameId')
  @UseGuards(AuthenticationGuard)
  async removeGame(
    @Headers('authorization') authJwtToken,
    @Param('gameId') gameId: string
  ): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.removeGame(user.email, gameId);
  }

  @Get('/game/recommended')
  @UseGuards(AuthenticationGuard)
  async getRecommended(@Headers('authorization') authJwtToken): Promise<Game> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.getRecommended("638b5b1ab3273651992687dc"); 
    
  }

  //Reviews
  @Put('/review')
  @UseGuards(AuthenticationGuard)
  async addReview(
    @Headers('authorization') authJwtToken,
    @Body() review: Review
  ): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.addReview(user.email, review);
  }

  @Put('/review/:reviewId')
  @UseGuards(AuthenticationGuard)
  async updateReview(
    @Headers('authorization') authJwtToken,
    @Param('reviewId') reviewId: string,
    @Body() updatedReview: Review
  ): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.updateReview(user.email, reviewId, updatedReview);
  }

  @Delete('/review/:reviewId')
  @UseGuards(AuthenticationGuard)
  async removeReview(
    @Headers('authorization') authJwtToken,
    @Param('reviewId') reviewId: string
  ): Promise<User> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    return this.userDB.removeReview(user.email, reviewId);
  }
}
