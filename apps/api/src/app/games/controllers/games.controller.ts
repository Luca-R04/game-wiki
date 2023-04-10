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
  UnauthorizedException,
} from '@nestjs/common';
import { Review } from '../../../../../../shared/review';
import { Game } from '../../../../../../shared/game';
import { Actor } from '../../../../../../shared/actor';
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
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    game.userId = (await this.userDB.findUser(user.email))._id.toString();

    const returnGame = this.gamesDB.addGame(game);

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
  async updateGame(
    @Headers('authorization') authJwtToken,
    @Param('gameId') gameId: string,
    @Body() changes: Partial<Game>
  ): Promise<Game> {
    if (changes._id) {
      throw new BadRequestException("Can't update game id");
    }

    const user = jwt.verify(authJwtToken, JWT_SECRET);
    const verifyUser = await this.userDB.findUser(user.email);
    const verifyGame = await this.gamesDB.findOne(gameId);
    if (verifyGame.userId.toString() !== verifyUser._id.toString()) {
      throw new UnauthorizedException('Can not update other users games');
    }

    await this.userDB.updateGame(user.email, gameId, changes);

    return this.gamesDB.updateGame(gameId, changes);
  }

  @Delete(':gameId')
  async deleteGame(
    @Headers('authorization') authJwtToken,
    @Param('gameId') gameId: string
  ) {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    const game = await this.gamesDB.findOne(gameId);
    const verifyUser = await this.userDB.findUser(user.email);
    if (game.userId.toString() !== verifyUser._id.toString()) {
      throw new UnauthorizedException('Can not delete other users games');
    }

    game.reviews.forEach((review) => {
      this.userDB.removeReviewById(review.userId, review._id);
    });
    await this.userDB.removeGame(user.email, gameId);
    return this.gamesDB.deleteGame(gameId);
  }

  //Reviews
  @Get('/review/:gameId/:reviewId')
  async getReview(
    @Param('reviewId') reviewId: string,
    @Param('gameId') gameId: string
  ): Promise<Review> {
    return this.gamesDB.getReview(gameId, reviewId);
  }

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
    const verifyUser = await this.userDB.findUser(user.email);
    const verifyReview = await this.gamesDB.getReview(gameId, reviewId);
    if (verifyReview.userId.toString() !== verifyUser._id.toString()) {
      throw new UnauthorizedException('Can not update other users reviews');
    }

    await this.userDB.updateReview(user.email, reviewId, updatedReview);

    await this.gamesDB.updateReview(gameId, reviewId, updatedReview);
    return this.gamesDB.updatePercentage(gameId);
  }

  @Delete('/review/:gameId/:reviewId')
  async removeReview(
    @Headers('authorization') authJwtToken,
    @Param('reviewId') reviewId: string,
    @Param('gameId') gameId: string
  ): Promise<Game> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    const verifyUser = await this.userDB.findUser(user.email);
    const verifyReview = await this.gamesDB.getReview(gameId, reviewId);
    if (verifyReview.userId.toString() !== verifyUser._id.toString()) {
      throw new UnauthorizedException('Can not delete other users reviews');
    }

    await this.userDB.removeReview(user.email, reviewId);

    await this.gamesDB.removeReview(gameId, reviewId);
    return this.gamesDB.updatePercentage(gameId);
  }

  //Actors
  @Put('/actor/:gameId')
  async createActor(
    @Headers('authorization') authJwtToken,
    @Param('gameId') gameId: string,
    @Body() actor: Actor
  ): Promise<Game> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    const verifyGame = await this.gamesDB.findOne(gameId);
    const verifyUser = await this.userDB.findUser(user.email);
    if (verifyGame.userId.toString() !== verifyUser._id.toString()) {
      throw new UnauthorizedException(
        'Can not add actors to other users games'
      );
    }

    return this.gamesDB.createActor(gameId, actor);
  }

  @Put('/actor/:gameId/:actorId')
  async updateActor(
    @Headers('authorization') authJwtToken,
    @Param('gameId') gameId: string,
    @Param('actorId') actorId: string,
    @Body() actor: Partial<Actor>
  ): Promise<Game> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    const verifyGame = await this.gamesDB.findOne(gameId);
    const verifyUser = await this.userDB.findUser(user.email);
    if (verifyGame.userId.toString() !== verifyUser._id.toString()) {
      throw new UnauthorizedException(
        'Can not update actors from other users games'
      );
    }

    return this.gamesDB.updateActor(gameId, actorId, actor);
  }

  @Delete('/actor/:gameId/:actorId')
  async deleteActor(
    @Headers('authorization') authJwtToken,
    @Param('gameId') gameId: string,
    @Param('actorId') actorId: string
  ): Promise<Game> {
    const user = jwt.verify(authJwtToken, JWT_SECRET);
    const verifyGame = await this.gamesDB.findOne(gameId);
    const verifyUser = await this.userDB.findUser(user.email);
    if (verifyGame.userId.toString() !== verifyUser._id.toString()) {
      throw new UnauthorizedException(
        'Can not delete actors from other users games'
      );
    }

    return this.gamesDB.deleteActor(gameId, actorId);
  }
}
