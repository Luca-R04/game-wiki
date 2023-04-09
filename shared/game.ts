import { Actor } from './actor';
import { Review } from './review';

export interface Game {
  _id: string;
  name: string;
  price: number;
  category: string;
  releaseDate: Date;
  image: string;
  description: string;
  positivePercent: number;
  gameId: string;
  userId: string;
  recommendorName?: string,
  actors: Array<Actor>;
  reviews: Array<Review>;
}
