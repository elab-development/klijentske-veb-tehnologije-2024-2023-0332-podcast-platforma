import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy, docData, doc } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';
import { IPodcast } from '../../interfaces/ipodcast';

@Injectable({
  providedIn: 'root'
})
export class GetPodcasts {
  constructor(private firestore: Firestore, private auth: Auth) {}

  getAllPodcasts(): Observable<IPodcast[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          const ref = collection(this.firestore, 'podcasts');
          const q = query(ref, orderBy('uploadDate', 'desc'));
          return collectionData(q, { idField: 'id' }) as Observable<IPodcast[]>;
        } else {
          return of([]);
        }
      })
    );
  }

  getPodcastById(id: string): Observable<IPodcast | null> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          const docRef = doc(this.firestore, `podcasts/${id}`);
          return docData(docRef, { idField: 'id' }) as Observable<IPodcast>;
        } else {
          return of(null);
        }
      })
    );
  }
}
