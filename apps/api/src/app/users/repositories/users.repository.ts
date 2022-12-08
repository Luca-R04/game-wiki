import { Injectable } from '@nestjs/common';
import { User } from 'shared/user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findUser(email: string): Promise<User> {
    return this.userModel.findOne({ email: email });
  }
}
