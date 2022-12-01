import { Module } from "@nestjs/common";
import { GamesController } from "./controllers/games.controller";

@Module({
    controllers: [GamesController],
})
export class GamesModule {

}