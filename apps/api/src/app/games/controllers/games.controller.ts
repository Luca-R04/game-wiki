/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get } from "@nestjs/common";
import { Game } from '../../../../../../shared/game';
import { findAllGames } from '../../../../db-data';

@Controller()
export class GamesController {

    @Get('/games')
    async findAllGames(): Promise<Game[]> {

        return findAllGames();
    }
}