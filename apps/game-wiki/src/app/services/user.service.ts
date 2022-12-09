/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../../../../shared/user';
import { JsonPipe } from '@angular/common';
import { Game } from 'shared/game';

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
