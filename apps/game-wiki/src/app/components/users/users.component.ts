/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../../../shared/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'game-wiki-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  user: User | undefined;

  constructor(private userService: UserService, private router: Router) {}

  getUser(): void {
    this.userService.getUsers().subscribe((user) => (this.user = user));
  }
  
  logout() {
    localStorage.removeItem("authJwtToken");
    this.router.navigateByUrl('/');
  }
//
  ngOnInit(): void {
    this.getUser();
  }

}
