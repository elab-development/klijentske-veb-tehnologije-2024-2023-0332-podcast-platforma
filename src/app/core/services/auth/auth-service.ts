import { inject, Injectable } from '@angular/core';
import {Auth, signInWithEmailAndPassword, UserCredential} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 constructor(private auth: Auth) {}

  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
  try {
    await this.auth.signOut();
  } catch (error) {
    console.error('Odjava error:', error);
    throw error;
  }
}
}
