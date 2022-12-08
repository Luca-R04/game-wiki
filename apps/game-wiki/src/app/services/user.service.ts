/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../../../../shared/user';
import { USERS } from '../models/mock-users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    const users = of(USERS);
    return users;
  }

  deleteUser(user: User): void {
    USERS.splice(USERS.indexOf(user), 1);
  }

  addUser(user: any): void {
    user.id = USERS[USERS.length - 1].id + 1;
    USERS.push(user);
  }
}
