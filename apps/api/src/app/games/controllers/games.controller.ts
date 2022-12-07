/* eslint-disable @typescript-eslint/no-empty-function */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Game } from '../../../../../../shared/game';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { GamesRepository } from '../repositories/games.repository';

@Controller('games')
@UseGuards(AuthenticationGuard)
export class GamesController {
  constructor(private gamesDB: GamesRepository) {}

  @Post()
  async createGame(@Body() game: Game): Promise<Game> {
    console.log('creating game');

    if (game._id) {
      throw new BadRequestException("Can't set game id");
    }

    return this.gamesDB.addGame(game);
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
    @Param('gameId') gameId: string,
    @Body() changes: Game
  ): Promise<Game> {
    console.log('updating game');

    if (changes._id) {
      throw new BadRequestException("Can't update course id");
    }

    return this.gamesDB.updateGame(gameId, changes);
  }

  @Delete(':gameId')
  async deleteGame(@Param('gameId') gameId: string) {
    console.log('deleting game');
    return this.gamesDB.deleteGame(gameId);
  }
}
