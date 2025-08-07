import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';
import { Podcast } from '../../interfaces/podcast';

@Injectable({
  providedIn: 'root'
})
export class GetPodcasts {
  constructor(private firestore: Firestore, private auth: Auth) {}

  getAllPodcasts(): Observable<Podcast[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          const ref = collection(this.firestore, 'podcasts');
          const q = query(ref, orderBy('uploadDate', 'desc'));
          return collectionData(q, { idField: 'id' }) as Observable<Podcast[]>;
        } else {
          return of([]);
        }
      })
    );
  }
}
