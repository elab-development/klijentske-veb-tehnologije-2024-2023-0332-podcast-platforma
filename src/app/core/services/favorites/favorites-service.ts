import { Injectable, inject, EnvironmentInjector } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, docData, collection, collectionData } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

   getUserFavorites$(): Observable<{ videoId: string; addedAt: Date }[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);
        const favsRef = collection(this.firestore, `users/${user.uid}/favorites`);
        return collectionData(favsRef, { idField: 'id' }).pipe(
          map(favs => favs.map(f => ({
            videoId: f['videoId'],
            addedAt: f['addedAt']?.toDate ? f['addedAt'].toDate() : new Date(f['addedAt'])
          })))
        );
      })
    );
  }
}
