import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-home-page',
  imports: [Navbar],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
 constructor(private authService: AuthService, private router: Router) {}

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']); 
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
