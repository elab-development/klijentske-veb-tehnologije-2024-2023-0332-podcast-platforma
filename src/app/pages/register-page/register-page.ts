import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  username: string = '';
  ime: string = '';
  errMsg: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
      try {
       const userCredential = await this.authService.register(this.email, this.password, this.username, this.ime);
        this.router.navigate(['/home']);
    } catch (error) {
      this.showError('Neuspešna registracija. Proverite podatke.');
      console.error('Registration error:', error);
    }
  }

    showError(message: string) {
  this.errMsg = message;
  setTimeout(() => {
    this.errMsg = '';
  }, 3000);
}
}
