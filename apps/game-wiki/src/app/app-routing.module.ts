import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { UsersComponent } from './components/users/users.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { GamesComponent } from './components/games/games.component';
import { GameDetailComponent } from './components/game-detail/game-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: 'games', component: GamesComponent },
  { path: 'game/:id', component: GameDetailComponent },
  { path: 'users', component: UsersComponent },
  { path: 'about', component: AboutComponent },
  { path: 'add', component: UserAddComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
