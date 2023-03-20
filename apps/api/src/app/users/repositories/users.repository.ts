import { Injectable } from '@nestjs/common';
import { User } from 'shared/user';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from 'shared/game';
import { Review } from 'shared/review';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private neoService: Neo4jService
  ) {}

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

  deleteUser(userId: string) {
    return this.userModel.deleteOne({ _id: userId });
  }

  async addFriend(email: string, friend: User): Promise<User> {
    const currentUser = await this.userModel.findOne({ email: email });
    const friendUser = await this.userModel.findById({ _id: friend._id });

    // Check if the user already contains the friend by _id
    const friendExists = currentUser.friends.some((existingFriend) =>
      new Types.ObjectId(existingFriend._id).equals(
        new Types.ObjectId(friend._id)
      )
    );
    if (friendExists) {
      throw new Error('Friend already exists');
    }

    await this.neoService.write(
      `MATCH (u:User {userId: $userId}), (fu:User {userId: $friendId}) CREATE (u)-[:FOLLOWS]->(fu)`,
      {
        userId: currentUser.id,
        friendId: friendUser.id,
      }
    );

    currentUser.friends.push(friend);
    await currentUser.save();
    return currentUser.toObject({ versionKey: false });
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
      { email, 'games.gameId': gameId },
      {
        $set: {
          'games.$.name': updatedGame.name,
          'games.$.image': updatedGame.image,
        },
      },
      { new: true }
    );
    return user;
  }

  async removeGame(email: string, gameId: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      {
        $pull: {
          games: { gameId: gameId },
          reviews: { gameId: gameId },
        },
      },
      { new: true }
    );
    return user;
  }

  async getRecommended(userId: string): Promise<any> {
    const result = await this.neoService.read(
      `
        MATCH (user1:User {userId: $userId})-[:FOLLOWS]->(user2:User)-[:HAS_REVIEW]->(review:Review)
        WHERE review.isPositive = true
        WITH user1, user2, review, rand() AS rand
        ORDER BY rand
        LIMIT 1
        RETURN review, user2.username
      `,
      {
        userId: userId,
      }
    );
    const record = result.records[0];
    return {
      review: record.get("review").properties,
      userName: record.get("user2.username")
    };
  }
  

  async addReview(email: string, review: Review): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    user.reviews.push(review);
    user.save();

    await this.neoService.write(
      `
      MATCH (u:User {userId: $userId})
      CREATE (u)-[:HAS_REVIEW]->(r:Review {reviewId: $reviewId, gameId: $gameId, isPositive: $isPositive})
    `,
      {
        userId: user.id,
        reviewId: review.reviewId,
        gameId: review.gameId,
        isPositive: review.isPositive,
      }
    );

    return user.toObject({ versionKey: false });
  }

  async updateReview(
    email: string,
    reviewId: string,
    updatedReview: Review
  ): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email, 'reviews.reviewId': reviewId },
      {
        $set: {
          'reviews.$.message': updatedReview.message,
          'reviews.$.reviewDate': updatedReview.reviewDate,
          'reviews.$.isPositive': updatedReview.isPositive,
        },
      },
      { new: true }
    );
    return user;
  }

  async removeReview(email: string, reviewId: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { $pull: { reviews: { reviewId: reviewId } } },
      { new: true }
    );
    return user;
  }

  async removeReviewById(userId: string, reviewId: string) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { reviews: { reviewId: reviewId } } },
      { new: true }
    );
    return user;
  }
}
