import * as mongoose from 'mongoose';

export const FriendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});
