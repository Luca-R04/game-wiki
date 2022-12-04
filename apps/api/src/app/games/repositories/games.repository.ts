import { Injectable } from '@nestjs/common';
import { Game } from 'shared/game';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GamesRepository {
  constructor(@InjectModel('Game') private gameModel: Model<Game>) {}

  async findAll(): Promise<Game[]> {
    return this.gameModel.find();
  }
}
