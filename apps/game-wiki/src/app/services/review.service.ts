import { Injectable } from '@angular/core';
import { Review } from 'shared/review';
import { Game } from 'shared/game';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'shared/user';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private http: HttpClient) {}

  addReview(review: Partial<Review>, gameId: string): Observable<Game> {
    console.log(review);
    return this.http.put<Game>(`/api/games/review/${gameId}`, review);
  }
}
