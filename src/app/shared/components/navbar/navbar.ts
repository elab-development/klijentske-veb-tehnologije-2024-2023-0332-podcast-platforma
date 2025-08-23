import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../core/models/user/user';
import { GetUser } from '../../../core/services/user/get-user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isOpen = false;
  user?: User;
  private router = inject(Router);
  searchQ = '';

  constructor(private getUser: GetUser) {}

  ngOnInit(): void {
    this.getUser.getCurrentUser().subscribe(userData => {
      this.user = userData;
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
    onSearch() {
    const q = (this.searchQ || '').trim();
    if (!q) return;
    this.router.navigate(['/search'], { queryParams: { q } });
  }
}