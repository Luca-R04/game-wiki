/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'game-wiki-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
})
export class UserAddComponent implements OnInit {
  constructor(private userService: UserService, private formBuilder: FormBuilder,) {}

  createForm = this.formBuilder.group({
    name: '',
    email: '',
    password: '',
    birthday: ''
  });

  onSubmit(): void {
    console.log(this.createForm.value)

    this.userService.addUser(this.createForm.value);
  }

  ngOnInit(): void {}
}
