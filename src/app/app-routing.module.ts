import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';

import { RegistrationComponent } from './components/registration/registration.component';

import { TransactionRegComponent } from './components/transaction/transaction-reg/transaction-reg.component';

import { BudgetTrackerComponent } from './components/budget-tracker/budget-tracker.component';
import { UserDetailsComponent } from './components/users/user-details/user-details.component';
import { UsersComponent } from './components/users/users.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { GoogleRegistrationComponent } from './components/registration/google-registration/google-registration.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent },

  { path: 'login', component: LoginComponent },
  {
    path: 'registration',
    component: RegistrationComponent,
  },

  { path: 'registrationWithGoogle', component: GoogleRegistrationComponent },
  {
    path: 'registrationWithGoogle/:id',
    component: GoogleRegistrationComponent,
  },

  {
    path: 'users',
    canActivate: [AuthGuard],
    data: { role: 'admin' },
    component: UsersComponent,
    children: [{ path: ':id', component: UserDetailsComponent }],
  },

  {
    path: 'transaction-reg',
    canActivate: [AuthGuard],
    data: { role: 'user' },
    component: TransactionRegComponent,
  },
  {
    path: 'transaction-reg/:id',
    // canActivate: [AuthGuard],
    // data: { role: 'user' },
    component: TransactionRegComponent,
  },

  {
    path: 'budget',
    canActivate: [AuthGuard],
    data: { role: 'user' },
    component: BudgetTrackerComponent,
  },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
