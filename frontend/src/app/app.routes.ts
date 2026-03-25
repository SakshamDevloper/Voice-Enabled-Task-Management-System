import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TaskBoardComponent } from './tasks/components/task-board/task-board.component';

const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) return true;

  return router.createUrlTree(['/login']);
};

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TaskBoardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];