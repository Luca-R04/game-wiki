import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_CONNECTION } from '../constants';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GamesController } from './games/controllers/games.controller';

import { GamesModule } from './games/games.module';
import { GetUserMiddleware } from './middleware/get-user.middleware';
import { UsersController } from './users/controllers/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [GamesModule, UsersModule, AuthModule, MongooseModule.forRoot(MONGO_CONNECTION)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(GetUserMiddleware).forRoutes(GamesController, UsersController);
  }
}
