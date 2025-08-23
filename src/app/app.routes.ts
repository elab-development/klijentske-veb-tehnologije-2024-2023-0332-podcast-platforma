import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { HomePage } from './pages/home-page/home-page';
import { RegisterPage } from './pages/register-page/register-page';
import { VideoPage } from './pages/video-page/video-page'
import { Omiljeno } from './pages/omiljeno/omiljeno'
import { Category } from './shared/components/category/category';
import { ProfilePageComponent } from './pages/profile-page/profile-page';
import { UploadPodcastPage } from './pages/upload-podcast/upload-podcast';
import { SearchPage } from './pages/search-page/search-page';


export const routes: Routes = [
    { path: 'search', component: SearchPage },
    { path: 'upload', component: UploadPodcastPage },
    { path: 'profile/:id', component: ProfilePageComponent },
    { path: 'category/:id', component: Category},
    { path: 'omiljeno', component: Omiljeno },
    { path: 'video/:id', component: VideoPage },
    { path: 'register', component: RegisterPage },
    { path: 'login', component: LoginPage },
    { path: 'home', component: HomePage },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
