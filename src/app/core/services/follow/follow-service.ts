import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, docData, collection, query, where, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

export interface FollowDoc {
  follower: string;
  following: string;
  createdAt: any;
}

@Injectable({ providedIn: 'root' })
export class FollowService {
  private firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector);

  follow(currentUserId: string, targetUserId: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const id = `${currentUserId}_${targetUserId}`;
      const ref = doc(this.firestore, 'follows', id);
      await setDoc(ref, {
        follower: currentUserId,
        following: targetUserId,
        createdAt: new Date()
      } as FollowDoc);
    });
  }

  unfollow(currentUserId: string, targetUserId: string): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const id = `${currentUserId}_${targetUserId}`;
      const ref = doc(this.firestore, 'follows', id);
      await deleteDoc(ref);
    });
  }

  isFollowing(currentUserId: string, targetUserId: string): Observable<boolean> {
    const id = `${currentUserId}_${targetUserId}`;
    const ref = doc(this.firestore, 'follows', id);
    return docData(ref).pipe(map(doc => !!doc));
  }

  followersCount$(targetUserId: string): Observable<number> {
    const ref = collection(this.firestore, 'follows');
    const q = query(ref, where('following', '==', targetUserId));
    return collectionData(q).pipe(map(arr => arr.length));
  }

  followedUserIds$(currentUserId: string): Observable<string[]> {
    const ref = collection(this.firestore, 'follows');
    const q = query(ref, where('follower', '==', currentUserId));
    return collectionData(q).pipe(map((arr: any[]) => arr.map(x => x.following)));
  }
}
