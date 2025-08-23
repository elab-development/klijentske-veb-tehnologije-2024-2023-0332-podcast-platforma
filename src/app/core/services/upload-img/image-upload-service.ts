import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);

  private cloudName = 'diygy0sjl';
  private uploadPreset = 'users-photos';

  async uploadUserImage(userId: string, file: File, kind: 'photo'|'banner'): Promise<string> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', this.uploadPreset);
    form.append('folder', `users/${userId}`);

    const res: any = await firstValueFrom(this.http.post(url, form));
    const imageUrl: string = res.secure_url;

    const userRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(userRef, kind === 'photo' ? { photoURL: imageUrl } : { bannerURL: imageUrl });

    return imageUrl;
  }

  async uploadImageToFolder(folder: string, file: File): Promise<string> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', this.uploadPreset);
    form.append('folder', folder);

    const res: any = await firstValueFrom(this.http.post(url, form));
    return res.secure_url as string;
  }

  async uploadPodcastThumbnail(podcastId: string, file: File): Promise<string> {
    return this.uploadImageToFolder(`podcasts/${podcastId}`, file);
  }
}
