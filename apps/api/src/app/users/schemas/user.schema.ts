import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birthDay: {
    type: Date,
    required: true,
  },
  isMale: {
    type: Boolean,
    required: true,
  },
});
