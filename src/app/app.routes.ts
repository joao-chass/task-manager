import { Routes } from '@angular/router';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { TaskList } from './components/tasks/task-list/task-list';
import { AuthGuard } from './guards/auth-guard';
import { TaskForm } from './components/tasks/task-form/task-form';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'task', component: TaskList,  canActivate: [AuthGuard] },
    { path: 'tasks/new', component: TaskForm,  canActivate: [AuthGuard] },
    { 
        path: 'tasks/edit/:id', component: TaskForm,
        canActivate: [AuthGuard]
      },
      
      { path: '**', redirectTo: '/login' }
];
