import { Injectable } from '@nestjs/common';
import { User } from 'shared/user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findUser(email: string) {
    return await this.userModel.findOne({ email });
  }

  async createUser(user: User) {
    const newUser = new this.userModel(user);
    await newUser.save();
    return newUser.toObject({ versionKey: false });
  }
}
