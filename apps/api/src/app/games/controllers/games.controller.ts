/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get } from "@nestjs/common";
import { Game } from '../../../../../../shared/game';
import { GamesRepository } from "../repositories/games.repository";

@Controller()
export class GamesController {

    constructor(private gamesDB: GamesRepository) {

    }

    @Get('/games')
    async findAllGames(): Promise<Game[]> {

        return this.gamesDB.findAll();
    }
}