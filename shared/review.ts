export interface Review {
  _id: string;
  message: string;
  reviewDate: Date;
  isPositive: boolean;
  userName: string;
  userId: string;
  gameId: string;
  gameName: string;
  reviewId: string;
}
