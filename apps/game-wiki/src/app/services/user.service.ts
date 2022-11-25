/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { USERS } from '../models/mock-users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  constructor() {}
}
