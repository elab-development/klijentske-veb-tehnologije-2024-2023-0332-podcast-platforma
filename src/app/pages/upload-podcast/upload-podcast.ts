import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';

import { ImageUploadService } from '../../core/services/upload-img/image-upload-service'; 

function youtubeUrlValidator(ctrl: AbstractControl): ValidationErrors | null {
  const v = (ctrl.value ?? '').trim();
  if (!v) return { required: true };
  const rx = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[^\s]*)?$/;
  return rx.test(v) ? null : { youtube: true };
}

@Component({
  selector: 'app-upload-podcast',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-podcast.html',
  styleUrl: './upload-podcast.css'
})
export class UploadPodcastPage {
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);
  private images = inject(ImageUploadService);

  file = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    videoUrl: ['', [youtubeUrlValidator]],
    category: ['', [Validators.required, Validators.maxLength(60)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    duration: ['', [Validators.required, Validators.pattern(/^\d+$/)]], 
  });

  submitting = signal(false);
  canSubmit = computed(() => this.form.valid && !!this.file());

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.setFile(f);
  }
  onDrop(ev: DragEvent) {
    ev.preventDefault();
    const f = ev.dataTransfer?.files?.[0] ?? null;
    this.setFile(f);
  }
  onDragOver(ev: DragEvent) { ev.preventDefault(); }

  private setFile(f: File | null) {
    if (!f) { this.file.set(null); this.previewUrl.set(null); return; }
    if (!f.type.startsWith('image/')) { alert('Odaberite sliku za thumbnail.'); return; }
    this.file.set(f);
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(f);
  }

  async submit() {
    if (!this.canSubmit()) return;

    const user = this.auth.currentUser;
    if (!user) { alert('Morate biti prijavljeni.'); return; }

    this.submitting.set(true);
    try {

      const colRef = collection(this.firestore, 'podcasts');
      const docRef = doc(colRef);
      const podcastId = docRef.id;


      const imageUrl = await this.images.uploadPodcastThumbnail(podcastId, this.file()!);


      const f = this.form.value;
      await setDoc(docRef, {
        category: (f.category ?? '').trim(),
        description: (f.description ?? '').trim(),
        duration: String(f.duration ?? '').trim(),  
        thumbmailUrl: imageUrl,                     
        title: (f.title ?? '').trim(),
        uploadDate: serverTimestamp(),              
        videoUrl: (f.videoUrl ?? '').trim(),        
        uploadedBy: user.uid,                       
      });

      this.router.navigate(['/video', podcastId]);
    } catch (e) {
      console.error(e);
      alert('Neuspešan upload. Pokušaj ponovo.');
    } finally {
      this.submitting.set(false);
    }
  }
}
