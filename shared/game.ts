import { Actor } from './actor';
import { Review } from './review';

export interface Game {
  _id: string;
  id: number;
  name: string;
  price: number;
  category: string;
  releaseDate: Date;
  image: string;
  description: string;
  positivePercent: number;
  gameId: string;
  actors: Array<Actor>;
  reviews: Array<Review>;
}
