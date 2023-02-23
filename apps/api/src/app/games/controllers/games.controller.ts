/* eslint-disable @typescript-eslint/no-empty-function */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Review } from '../../../../../../shared/review';
import { Game } from '../../../../../../shared/game';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { UsersRepository } from '../../users/repositories/users.repository';
import { GamesRepository } from '../repositories/games.repository';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../constants';

@Controller('games')
@UseGuards(AuthenticationGuard)
export class GamesController {
  constructor(
    private gamesDB: GamesRepository,
    private userDB: UsersRepository
  ) {}

  @Post()
  async createGame(
    @Headers('authorization') authJwtToken,
    @Body() game: Game
  ): Promise<Game> {
    if (game._id) {
      throw new BadRequestException("Can't set game id");
    }

    const returnGame = this.gamesDB.addGame(game);

    const user = jwt.verify(authJwtToken, JWT_SECRET);
    game.gameId = (await returnGame)._id.toString();
    await this.userDB.addGame(user.email, game);

    return returnGame;
  }

  @Get()
  async findAllGames(): Promise<Game[]> {
    return this.gamesDB.findAll();
  }

  @Get(':gameId')
  async findGame(@Param('gameId') gameId: string): Promise<Game> {
    const game = await this.gamesDB.findOne(gameId);

    if (!game) {
      throw new NotFoundException('Could not find game with id ' + gameId);
    }
    return game;
  }

  @Put(':gameId')
  async updateGames(
    @Headers('authorization') authJwtToken,
    @Param('gameId') gameId: string,
    @Body() changes: Partial<Game>
  ): Promise<Game> {
    if (changes._id) {
      throw new BadRequestException("Can't update course id");
    }

    const user = jwt.verify(authJwtToken, JWT_SECRET);
    await this.userDB.updateGame(user.email, gameId, changes);

    return this.gamesDB.updateGame(gameId, changes);
  }

  @Delete(':gameId')
  async deleteGame(
    @Headers('authorization') authJwtToken,
    @Param('gameId') gameId: string
  ) {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    await this.userDB.removeGame(user.email, gameId);
    return this.gamesDB.deleteGame(gameId);
  }

  //Reviews
  @Put('/review/:gameId')
  async addReview(
    @Headers('authorization') authJwtToken,
    @Param('gameId') gameId: string,
    @Body() review: Review
  ): Promise<Game> {
    const returnGame = await this.gamesDB.addReview(gameId, review);

    const user = jwt.verify(authJwtToken, JWT_SECRET);
    review.gameName = returnGame.name;
    review.gameId = gameId;
    review.reviewId =
      returnGame.reviews[returnGame.reviews.length - 1]._id.toString();
    await this.userDB.addReview(user.email, review);

    return returnGame;
  }

  @Put('/review/:gameId/:reviewId')
  async updateReview(
    @Headers('authorization') authJwtToken,
    @Param('reviewId') reviewId: string,
    @Param('gameId') gameId: string,
    @Body() updatedReview: Review
  ): Promise<Game> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    await this.userDB.updateReview(user.email, reviewId, updatedReview);

    return this.gamesDB.updateReview(gameId, reviewId, updatedReview);
  }

  @Delete('/review/:gameId/:reviewId')
  async removeReview(
    @Headers('authorization') authJwtToken,
    @Param('reviewId') reviewId: string,
    @Param('gameId') gameId: string
  ): Promise<Game> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    await this.userDB.removeReview(user.email, reviewId);

    return this.gamesDB.removeReview(gameId, reviewId);
  }
}
