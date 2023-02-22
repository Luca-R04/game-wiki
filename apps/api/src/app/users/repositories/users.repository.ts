import { Injectable } from '@nestjs/common';
import { User } from 'shared/user';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from 'shared/game';
import { Review } from 'shared/review';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findUser(email: string): Promise<User> {
    return this.userModel.findOne({ email: email });
  }

  async findById(Id: string): Promise<User> {
    return this.userModel.findOne({ _id: Id });
  }

  updateUser(user: Partial<User>, updatedUser: Partial<User>): Promise<User> {
    return this.userModel
      .findOneAndUpdate({ email: user.email }, updatedUser, {
        new: true,
      })
      .exec();
  }

  deleteUser(user: any) {
    throw new Error('Method not implemented.');
  }

  async addFriend(email: string, friend: User): Promise<User> {
    const user = await this.userModel.findOne({ email: email });

    // Check if the user already contains the friend by _id
    const friendExists = user.friends.some((existingFriend) =>
      new Types.ObjectId(existingFriend._id).equals(
        new Types.ObjectId(friend._id)
      )
    );
    if (friendExists) {
      throw new Error('Friend already exists');
    }

    user.friends.push(friend);
    await user.save();
    return user.toObject({ versionKey: false });
  }

  async removeFriend(email: string, friendId: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { $pull: { friends: { _id: friendId } } },
      { new: true }
    );
    return user;
  }

  async addGame(email: string, game: Game): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    user.games.push(game);
    user.save();
    return user.toObject({ versionKey: false });
  }

  async updateGame(
    email: string,
    gameId: string,
    updatedGame: Partial<Game>
  ): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email, 'games._id': gameId },
      { $set: { 'games.$': updatedGame } },
      { new: true }
    );
    return user;
  }

  async removeGame(email: string, gameId: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { $pull: { games: { _id: gameId } } },
      { new: true }
    );
    return user;
  }

  async addReview(email: string, review: Review): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    user.reviews.push(review);
    user.save();
    return user.toObject({ versionKey: false });
  }

  async updateReview(
    email: string,
    reviewId: string,
    updatedReview: Review
  ): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email, 'reviews._id': reviewId },
      { $set: { 'reviews.$': updatedReview } },
      { new: true }
    );
    return user;
  }

  async removeReview(email: any, reviewId: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { $pull: { reviews: { _id: reviewId } } },
      { new: true }
    );
    return user;
  }
}
