import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardGuard } from './guard/guard.guard';
import { LoginComponent } from './pages/login/login.component';
import { GroupComponent } from './pages/securePages/group/group.component';
import { LobbyComponent } from './pages/securePages/lobby/lobby.component';
import { SignupComponent } from './pages/signup/signup.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'sign-up', component: SignupComponent },
      {
        path: 'user',
        children: [
          { path: 'lobby', component: LobbyComponent },
          { path: 'group/:id', component: GroupComponent },
        ],
        canActivate: [GuardGuard],
        canLoad: [GuardGuard],
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
