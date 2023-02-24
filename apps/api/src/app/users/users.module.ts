import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesModule } from '../games/games.module';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { UserSchema } from './schemas/users.schema';

@Module({
  imports: [
    forwardRef(() => GamesModule),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
