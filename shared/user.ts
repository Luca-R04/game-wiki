import { Game } from './game';
import { Review } from './review';

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  birthday: Date;
  games: Array<Game>;
  reviews: Array<Review>;
  friends: Array<User>;
}
