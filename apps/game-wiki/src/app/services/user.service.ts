/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../../shared/user';
import { Game } from 'shared/game';
import { Review } from 'shared/review';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User> {
    return this.http.get<User>('/api/user');
  }

  addFriend(friendId: string) {
    console.log(friendId);
    return this.http.put(
      `/api/user/`,
      JSON.parse(`{ "friendId": "${friendId}"}`)
    );
  }

  addGame(game: Game) {
    console.log(game);
    return this.http.put(`/api/user/game`, game);
  }

  deleteUser(user: User): void {}

  addUser(user: any): void {}
}
