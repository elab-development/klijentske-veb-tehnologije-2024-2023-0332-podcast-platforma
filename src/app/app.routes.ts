import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { HomePage } from './pages/home-page/home-page';
import { RegisterPage } from './pages/register-page/register-page';

export const routes: Routes = [
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage },
    { path: 'home', component: HomePage },
    { path: '', component: LoginPage },
    { path: '**', redirectTo: 'login' }
];
