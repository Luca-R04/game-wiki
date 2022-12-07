import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { UsersComponent } from './components/users/users.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { GamesComponent } from './components/games/games.component';
import { GameDetailComponent } from './components/game-detail/game-detail.component';
import { GameAddComponent } from './components/game-add/game-add.component';
import { GameEditComponent } from './components/game-edit/game-edit.component';
import { AddComponent } from './components/add/add.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'games', component: GamesComponent, canActivate: [AuthGuard]  },
  { path: 'game/:id', component: GameDetailComponent, canActivate: [AuthGuard]  },
  { path: 'edit-game/:id', component: GameEditComponent, canActivate: [AuthGuard]  },
  { path: 'add-game', component: GameAddComponent, canActivate: [AuthGuard]  },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard]  },
  { path: 'add-user', component: UserAddComponent, canActivate: [AuthGuard]  },
  { path: 'add', component: AddComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
