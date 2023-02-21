import { Injectable } from '@nestjs/common';
import { User } from 'shared/user';
import { Model } from 'mongoose';
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

  async addFriend(email: string, friend: User) {
    const user = await this.userModel.findOne({ email: email });
    user.friends.push(friend);
    await user.save();
    return user.toObject({ versionKey: false });
  }

  async addGame(email: string, game: Game) {
    const user = await this.userModel.findOne({ email: email });
    user.games.push(game);
    user.save();
    return user.toObject({ versionKey: false });
  }

  async addReview(email: string, review: Review) {
    const user = await this.userModel.findOne({ email: email });
    user.reviews.push(review);
    user.save();
    return user.toObject({ versionKey: false });
  }
}
