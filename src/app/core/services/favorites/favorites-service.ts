// src/app/core/services/favorites.service.ts
import { Injectable, inject, EnvironmentInjector } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(EnvironmentInjector);

  async addToFavorites(videoId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const favRef = doc(this.firestore, `users/${user.uid}/favorites/${videoId}`);
    await setDoc(favRef, {
      videoId,
      addedAt: new Date()
    });
  }

  async removeFromFavorites(videoId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const favRef = doc(this.firestore, `users/${user.uid}/favorites/${videoId}`);
    await deleteDoc(favRef);
  }


  isFavorite$(videoId: string): Observable<boolean> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const favRef = doc(this.firestore, `users/${user.uid}/favorites/${videoId}`);
    return docData(favRef).pipe(map(doc => !!doc));
  }
}
