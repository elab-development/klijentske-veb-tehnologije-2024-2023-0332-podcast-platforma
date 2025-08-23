import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy, docData, doc, where, DocumentData, QueryDocumentSnapshot, getDocs, limit, startAfter } from '@angular/fire/firestore';
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
  
  async getLatestPage(
  pageSize = 6,
  cursor?: QueryDocumentSnapshot<DocumentData> | null
): Promise<{ items: IPodcast[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const ref = collection(this.firestore, 'podcasts');
  const base = query(ref, orderBy('uploadDate', 'desc'), limit(pageSize));
  const qy = cursor
    ? query(ref, orderBy('uploadDate', 'desc'), startAfter(cursor), limit(pageSize))
    : base;

  const snap = await getDocs(qy);
  const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as IPodcast[];
  const lastDoc = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
  return { items, lastDoc };
}
}
