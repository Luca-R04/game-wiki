import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authJwtToken = localStorage.getItem('authJwtToken');

    if (authJwtToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `${authJwtToken}`),
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
