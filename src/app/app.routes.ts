import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { TaskList } from './components/tasks/task-list/task-list';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'task', component: TaskList,  canActivate: [AuthGuard] },
];
