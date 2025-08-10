import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { HomePage } from './pages/home-page/home-page';
import { RegisterPage } from './pages/register-page/register-page';
import { VideoPage } from './pages/video-page/video-page'

export const routes: Routes = [
    { path: 'video/:id', component: VideoPage },
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage },
    { path: 'home', component: HomePage },
    { path: '', component: LoginPage },
    { path: '**', redirectTo: 'login' }
];
