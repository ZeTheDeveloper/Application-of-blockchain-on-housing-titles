import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersHomeComponent } from './users-home/users-home.component';
import { AdminsHomeComponent } from './admins-home/admins-home.component';
import { AuthGuard } from './services/auth.guard'

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: LoginComponent },
  { path: 'users-home', component: UsersHomeComponent, canActivate:[AuthGuard] },
  { path: 'admins-home', component: AdminsHomeComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
