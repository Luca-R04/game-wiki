import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { UserAddComponent } from './user-add/user-add.component';

const routes: Routes = [{ path: 'users', component: UsersComponent }, { path: 'about', component: AboutComponent}, {path: 'add', component: UserAddComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
