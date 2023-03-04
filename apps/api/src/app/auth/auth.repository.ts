import { Injectable } from '@nestjs/common';
import { User } from 'shared/user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private neoService: Neo4jService
  ) {}

  async findUser(email: string) {
    return await this.userModel.findOne({ email });
  }

  async createUser(user: User) {
    const newUser = new this.userModel(user);
    await newUser.save();

    await this.neoService.write(
      `CREATE (u:User {userId: "${newUser.id}", username: "${newUser.name}", email: "${newUser.email}"})`
    );

    return newUser.toObject({ versionKey: false });
  }
}
