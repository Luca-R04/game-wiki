import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_CONNECTION, NEO4J_PWD, NEO4J_URI, NEO4J_USERNAME } from '../constants';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GamesController } from './games/controllers/games.controller';

import { GamesModule } from './games/games.module';
import { GetUserMiddleware } from './middleware/get-user.middleware';
import { UsersController } from './users/controllers/users.controller';
import { UsersModule } from './users/users.module';
import { Neo4jModule } from 'nest-neo4j';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_CONNECTION),
    Neo4jModule.forRoot({
      scheme: 'neo4j+s',
      host: NEO4J_URI,
      port: 7687,
      username: NEO4J_USERNAME,
      password: NEO4J_PWD,
    }),
    GamesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(GetUserMiddleware)
      .forRoutes(GamesController, UsersController);
  }
}
