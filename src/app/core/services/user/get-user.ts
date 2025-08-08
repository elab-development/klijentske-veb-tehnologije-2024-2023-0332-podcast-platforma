import { Injectable } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, switchMap, map } from 'rxjs';
import { User } from '../../models/user\/user';

@Injectable({
  providedIn: 'root'
})
export class GetUser {
  constructor(private firestore: Firestore, private auth: Auth) {}

  getCurrentUser(): Observable<User | undefined> {
    return authState(this.auth).pipe(
      switchMap(currentUser => {
        if (!currentUser) {
          return [undefined];
        }
        const ref = doc(this.firestore, `users/${currentUser.uid}`);
        return docData(ref, { idField: 'uid' }).pipe(
          map(data => data ? new User(data) : undefined)
        );
      })
    );
  }
}
