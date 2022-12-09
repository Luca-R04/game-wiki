/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { tap } from 'rxjs/operators';
import { noop } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'game-wiki-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    const loginForm = {
      email: '',
      password: '',
    };
    this.form = this.formBuilder.group(loginForm);
  }

  ngOnInit() {}

  login() {
    const val = this.form.value;

    this.auth.login(val.email, val.password).subscribe(
      (reply: any) => {
        localStorage.setItem('authJwtToken', reply.authJwtToken);

        this.router.navigateByUrl('/games');
      },
      (err) => {
        console.log('Login failed:', err);
        alert('Login failed.');
      }
    );
  }
}
