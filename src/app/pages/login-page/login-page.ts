import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errMsg: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      console.log('Prijava uspešna:', userCredential);
      this.router.navigate(['/home']);
       console.log('Navigacija izvršena');
    } catch (error) {
      this.showError('Neuspešna prijava. Proverite podatke.');
      console.error('Login error:', error);
    }
  }

  showError(message: string) {
  this.errMsg = message;
  setTimeout(() => {
    this.errMsg = '';
  }, 3000);
}
}
