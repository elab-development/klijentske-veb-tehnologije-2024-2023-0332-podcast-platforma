import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  CollectionReference,
  DocumentData,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { GetUser } from '../user/get-user';
import { IComment } from '../../interfaces/icomment';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private getUser = inject(GetUser);

  private col(podcastId: string): CollectionReference<DocumentData> {
    return collection(this.firestore, `podcasts/${podcastId}/comments`);
  }


  async addComment(podcastId: string, content: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Korisnik nije prijavljen');

    const userDoc = await firstValueFrom(this.getUser.getUserById(user.uid));
    const username = userDoc?.username ?? 'Nepoznat';

    await addDoc(this.col(podcastId), {
      userId: user.uid,
      username,
      content: content.trim(),
      createdAt: serverTimestamp(),
    });
  }

  async getCommentsPage(
    podcastId: string,
    pageSize = 3,
    cursor?: QueryDocumentSnapshot<DocumentData> | null
  ): Promise<{ items: IComment[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const base = query(this.col(podcastId), orderBy('createdAt', 'desc'), limit(pageSize));
    const q = cursor ? query(this.col(podcastId), orderBy('createdAt', 'desc'), startAfter(cursor), limit(pageSize)) : base;

    const snap = await getDocs(q);
    const items: IComment[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as IComment) }));
    const lastDoc = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
    return { items, lastDoc };
  }
}
