/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Game } from '../../../../../../shared/game';
import { GamesRepository } from '../repositories/games.repository';

@Controller('games')
export class GamesController {
  constructor(private gamesDB: GamesRepository) {}

  @Post()
  async createGame(@Body() game: Partial<Game>): Promise<Game> {
    console.log('creating game');
    return this.gamesDB.addGame(game);
  }

  @Get()
  async findAllGames(): Promise<Game[]> {
    return this.gamesDB.findAll();
  }

  @Get(':gameId')
  async findGame(@Param('gameId') gameId: string): Promise<Game> {
    return this.gamesDB.findOne(gameId);
  }

  @Put(':gameId')
  async updateGames(
    @Param('gameId') gameId: string,
    @Body() changes: Partial<Game>
  ): Promise<Game> {
    console.log('updating game');
    return this.gamesDB.updateGame(gameId, changes);
  }

  @Delete(':gameId')
  async deleteGame(@Param('gameId') gameId: string) {
    console.log('deleting game');
    return this.gamesDB.deleteGame(gameId);
  }
}
