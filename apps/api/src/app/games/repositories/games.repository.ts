import { Injectable } from '@nestjs/common';
import { Game } from 'shared/game';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from 'shared/review';

@Injectable()
export class GamesRepository {
  constructor(@InjectModel('Game') private gameModel: Model<Game>) {}

  async addGame(game: Partial<Game>): Promise<Game> {
    const newGame = new this.gameModel(game);
    await newGame.save();
    return newGame.toObject({ versionKey: false });
  }

  async findAll(): Promise<Game[]> {
    return this.gameModel.find();
  }

  async findOne(gameId: string): Promise<Game> {
    return this.gameModel.findOne({ _id: gameId });
  }

  async updateGame(gameId: string, changes: Partial<Game>): Promise<Game> {
    console.log(gameId, changes);
    return this.gameModel.findOneAndUpdate({ _id: gameId }, changes, {
      new: true,
    });
  }

  async deleteGame(gameId: string) {
    return this.gameModel.deleteOne({ _id: gameId });
  }

  async addReview(gameId: string, review: Review) {
    const game = await this.gameModel.findOne({ _id: gameId });
    console.log(game);
    game.reviews.push(review);
    game.save();
    return game.toObject({ versionKey: false });
  }
}
