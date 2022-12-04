import * as mongoose from 'mongoose';

export const GameSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    category: String,
    releaseDate: Date,
    image: String,
    description: String,
    positivePercent: Number
});