import { Injectable } from '@nestjs/common';
import { Game } from 'shared/game';
import mongoose, { Model } from 'mongoose';
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
    return this.gameModel.find({}, { image: 1, name: 1, description: 1 });
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

  //Reviews
  async addReview(gameId: string, review: Review) {
    const game = await this.gameModel.findOne({ _id: gameId });
    game.reviews.push(review);

    let positives = 0;
    game.reviews.forEach((element) => {
      if (element.isPositive) {
        positives++;
      }
    });

    game.positivePercent = (positives / game.reviews.length) * 100;
    game.save();
    return game.toObject({ versionKey: false });
  }

  async updateReview(
    gameId: string,
    reviewId: string,
    updatedReview: Review
  ): Promise<Game> {
    const game = await this.gameModel.findOneAndUpdate(
      { _id: gameId, 'reviews._id': reviewId },
      {
        $set: {
          'reviews.$.message': updatedReview.message,
          'reviews.$.reviewDate': updatedReview.reviewDate,
          'reviews.$.isPositive': updatedReview.isPositive,
        },
      },
      { new: true }
    );
    return game;
  }

  async removeReview(gameId: string, reviewId: string): Promise<Game> {
    const objectId = new mongoose.Types.ObjectId(gameId);
    const user = await this.gameModel.findByIdAndUpdate(
      { _id: objectId },
      { $pull: { reviews: { _id: reviewId } } },
      { new: true }
    );
    return user;
  }
}
