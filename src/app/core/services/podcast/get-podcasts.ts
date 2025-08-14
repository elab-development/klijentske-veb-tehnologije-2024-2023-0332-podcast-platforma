import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy, docData, doc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IPodcast } from '../../interfaces/ipodcast';

@Injectable({ providedIn: 'root' })
export class GetPodcasts {
  private firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector);

  getPodcastById(id: string): Observable<IPodcast> {
    return runInInjectionContext(this.injector, () => {
      const docRef = doc(this.firestore, `podcasts/${id}`);
      return docData(docRef, { idField: 'id' }) as Observable<IPodcast>;
    });
  }

  getPodcastsByUserId(userId: string): Observable<IPodcast[]> {
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'podcasts');
      const q = query(ref, where('uploadedBy', '==', userId), orderBy('uploadDate', 'desc'));
      return collectionData(q, { idField: 'id' }) as Observable<IPodcast[]>;
    });
  }

  getAllPodcasts(): Observable<IPodcast[]> {
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'podcasts');
      const q = query(ref, orderBy('uploadDate', 'desc'));
      return collectionData(q, { idField: 'id' }) as Observable<IPodcast[]>;
    });
  }
}
