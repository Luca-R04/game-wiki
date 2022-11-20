/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
import { USERS } from './mock-users';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  getUsers(): Observable<User[]> {
    const users = of(USERS);
    return users;
  }

  deleteUser(user: User): void {
    delete USERS[user.id - 1];
  }

  addUser(user: any): void {
    user.id = USERS.length + 1;
    USERS.push(user);
  }

  constructor() { }
}
