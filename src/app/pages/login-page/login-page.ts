import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errMsg: string = '';
  busy = false;
  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.errMsg = '';
    this.busy = true;
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      console.log('Prijava uspešna:', userCredential);
      this.router.navigate(['/home']);
       console.log('Navigacija izvršena');
    } catch (error) {
      this.showError('Neuspešna prijava. Proverite podatke.');
      console.error('Login error:', error);
    } finally {
      this.busy = false;
    }
  }
async onResetPassword(ev?: Event) {
    ev?.preventDefault();
    this.errMsg = '';
    if (!this.email) {
      this.showError('Unesite email koji ste koristili pri registraciji.');
      return;
    }
    this.busy = true;
    try {
      await this.authService.resetPassword(this.email);
      this.showError('Poslali smo vam email sa linkom za reset lozinke.');
    } catch (e) {
      this.showError(this.mapError(e));
      console.error('Reset password error:', e);
    } finally { this.busy = false; }
  }

  showError(message: string) {
  this.errMsg = message;
  setTimeout(() => {
    this.errMsg = '';
  }, 3000);
}

  private mapError(e: any): string {
    const code = e?.code || e?.message || '';
    if (code.includes('auth/invalid-email')) return 'Email adresa nije ispravnog formata.';
    if (code.includes('auth/user-not-found')) return 'Nalog sa tim emailom ne postoji.';
    if (code.includes('auth/too-many-requests')) return 'Previše zahteva. Pokušajte kasnije.';
    return 'Došlo je do greške. Pokušajte ponovo.';
  }
}
