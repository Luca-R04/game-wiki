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

  constructor() { }
}
