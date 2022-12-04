import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { MONGO_CONNECTION } from '../constants';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GamesModule } from './games/games.module';

@Module({
  imports: [GamesModule, MongooseModule.forRoot(MONGO_CONNECTION)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
