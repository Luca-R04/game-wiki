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
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
