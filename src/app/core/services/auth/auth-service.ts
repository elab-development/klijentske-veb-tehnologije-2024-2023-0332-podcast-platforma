import { inject, Injectable } from '@angular/core';
import {Auth, signInWithEmailAndPassword, UserCredential, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
 constructor(private auth: Auth, private firestore: Firestore) {}

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

  async register(email: string, password: string, username: string, ime: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      await updateProfile(userCredential.user, { displayName: username });

      const userDoc = doc(this.firestore, 'users', userCredential.user.uid);
      await setDoc(userDoc, {
        uid: userCredential.user.uid,
        email: email,
        username: username,
        ime: ime,
        createdAt: new Date()
      });
      return userCredential;

    } catch (error) {
      throw error;
    }
  }

   async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email.trim());
  }
}
