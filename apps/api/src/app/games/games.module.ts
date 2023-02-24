import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from '../users/repositories/users.repository';
import { UserSchema } from '../users/schemas/users.schema';
import { UsersModule } from '../users/users.module';
import { GamesController } from './controllers/games.controller';
import { GamesRepository } from './repositories/games.repository';
import { GameSchema } from './schemas/games.schema';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: 'Game',
        schema: GameSchema,
      },
    ]),
  ],
  controllers: [GamesController],
  providers: [GamesRepository],
  exports: [GamesRepository],
})
export class GamesModule {}
