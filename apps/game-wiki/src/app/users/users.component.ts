/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { USERS } from '../mock-users'

@Component({
  selector: 'game-wiki-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})

export class UsersComponent implements OnInit {
  users = USERS;

  constructor() {}

  ngOnInit(): void {}
}
