import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesController } from './controllers/games.controller';
import { GamesRepository } from './repositories/games.repository';
import { GameSchema } from './schemas/games.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Game',
        schema: GameSchema,
      },
    ]),
  ],
  controllers: [GamesController],
  providers: [GamesRepository],
})
export class GamesModule {}
