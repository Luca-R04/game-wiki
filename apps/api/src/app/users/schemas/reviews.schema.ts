import * as mongoose from 'mongoose';

export const ReviewSchema = new mongoose.Schema({
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
  gameName: {
    type: String,
    required: true,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
  },
});
