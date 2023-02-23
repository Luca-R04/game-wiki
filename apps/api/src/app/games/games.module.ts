import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from '../users/repositories/users.repository';
import { UserSchema } from '../users/schemas/users.schema';
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
      {
        name: 'User',
        schema: UserSchema
      },
    ]),
  ],
  controllers: [GamesController],
  providers: [GamesRepository, UsersRepository],
})
export class GamesModule {}
