import * as mongoose from 'mongoose';
import { ActorsSchema } from './actors.schema';
import { ReviewSchema } from './reviews.schema';

export const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  positivePercent: Number,
  recommendorName: String,
  actors: [ActorsSchema],
  reviews: [ReviewSchema],
});
