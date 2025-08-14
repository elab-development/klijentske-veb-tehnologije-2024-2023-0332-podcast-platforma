import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, switchMap, map, of } from 'rxjs';
import { User } from '../../models/user/user';

@Injectable({ providedIn: 'root' })
export class GetUser {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(EnvironmentInjector);

  getCurrentUser(): Observable<User | undefined> {
    return runInInjectionContext(this.injector, () => {
      return authState(this.auth).pipe(
        switchMap(currentUser => {
          if (!currentUser) return of(undefined);
          const ref = doc(this.firestore, `users/${currentUser.uid}`);
          return docData(ref, { idField: 'uid' }).pipe(
            map(data => data ? new User(data) : undefined)
          );
        })
      );
    });
  }

  getUserById(userId: string): Observable<User | undefined> {
    return runInInjectionContext(this.injector, () => {
      const ref = doc(this.firestore, `users/${userId}`);
      return docData(ref, { idField: 'uid' }).pipe(
        map(data => data ? new User(data) : undefined)
      );
    });
  }
}
