import * as mongoose from 'mongoose';

export const ActorsSchema = new mongoose.Schema({
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
