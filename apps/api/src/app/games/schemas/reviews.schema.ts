import * as mongoose from 'mongoose';

export const reviewSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  reviewDate: {
    type: Date,
    required: true,
  },
  isPositive: {
    type: Boolean,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});
