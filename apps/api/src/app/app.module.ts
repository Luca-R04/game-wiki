import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { MONGO_CONNECTION } from '../constants';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { GamesModule } from './games/games.module';

@Module({
  imports: [GamesModule, AuthModule, MongooseModule.forRoot(MONGO_CONNECTION)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
