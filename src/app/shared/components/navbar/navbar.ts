import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../../core/models/user/user';
import { GetUser } from '../../../core/services/user/get-user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  user?: User;

  constructor(private getUser: GetUser) {}

  ngOnInit(): void {
    this.getUser.getCurrentUser().subscribe(userData => {
      this.user = userData;
    });
  }
}
