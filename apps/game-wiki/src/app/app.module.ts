import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsersComponent } from './components/users/users.component';
import { AboutComponent } from './components/about/about.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { UserAddComponent } from './components/user-add/user-add.component';
import { GamesComponent } from './components/games/games.component';
import { GameDetailComponent } from './components/game-detail/game-detail.component';
import { AddComponent } from './components/add/add.component';
import { GameAddComponent } from './components/game-add/game-add.component';
import { GameEditComponent } from './components/game-edit/game-edit.component';
import { NavComponent } from './components/nav/nav.component';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './auth/auth.interceptor';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    AboutComponent,
    UserDetailComponent,
    UserAddComponent,
    GamesComponent,
    GameDetailComponent,
    AddComponent,
    GameAddComponent,
    GameEditComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AuthModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
