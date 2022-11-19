/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'game-wiki-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  @Input() user?: User;

  constructor() {}

  ngOnInit(): void {}
}
