import { Timestamp } from '@angular/fire/firestore';

export interface IComment {
  id?: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Timestamp;
}