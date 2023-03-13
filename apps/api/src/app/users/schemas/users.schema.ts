import * as mongoose from 'mongoose';
import { FriendSchema } from './friends.schema';
import { GameSchema } from './games.schema';
import { ReviewSchema } from './reviews.schema';

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  games: [GameSchema],
  friends: [FriendSchema],
  reviews: [ReviewSchema],
});
