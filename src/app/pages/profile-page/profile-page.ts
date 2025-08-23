import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PodcastCardComponent } from '../../shared/components/podcast-card/podcast-card';
import { GetUser } from '../../core/services/user/get-user';
import { GetPodcasts } from '../../core/services/podcast/get-podcasts';
import { AuthService } from '../../core/services/auth/auth-service';
import { User } from '../../core/models/user/user';
import { IPodcast } from '../../core/interfaces/ipodcast';
import { FollowService } from '../../core/services/follow/follow-service'; 
import { ImageUploadService } from '../../core/services/upload-img/image-upload-service';
import { Observable, of, switchMap, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css'],
  standalone: true,
  imports: [PodcastCardComponent, CommonModule, RouterModule, FormsModule]
})
export class ProfilePageComponent implements OnInit {
  userId!: string;
  user?: User;

  podcasts: IPodcast[] = [];
  displayedPodcasts: IPodcast[] = [];
  pageSize = 3;
  currentPage = 1;
  sortOption = '';

  currentUserId: string | null = null;
  isOwnProfile = false;

  followersCount$?: Observable<number>;
  isFollowing$?: Observable<boolean>;

  flashMsg = '';
  flashTimer?: any;

  constructor(
    private route: ActivatedRoute,
    private userService: GetUser,
    private podcastService: GetPodcasts,
    private followService: FollowService,
    private uploadSvc: ImageUploadService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;

    this.userService.getUserById(this.userId).subscribe(user => {
      this.user = user;
    });

    this.userService.getCurrentUser().subscribe(me => {
      this.currentUserId = me?.uid || null;
      this.isOwnProfile = !!this.currentUserId && this.currentUserId === this.userId;

      this.followersCount$ = this.followService.followersCount$(this.userId);
      this.isFollowing$ = this.currentUserId
        ? this.followService.isFollowing(this.currentUserId, this.userId)
        : of(false);
    });

    this.podcastService.getPodcastsByUserId(this.userId).subscribe(podcasts => {
      this.podcasts = podcasts;
      this.displayedPodcasts = [];
      this.currentPage = 1;
      this.loadMore();
    });
  }

  loadMore() {
    const start = 0;
    const end = this.currentPage * this.pageSize;
    this.displayedPodcasts = this.podcasts.slice(start, end);
    this.currentPage++;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  sortPodcasts() {
    switch (this.sortOption) {
      case 'newest':
        this.displayedPodcasts.sort((a, b) => this.getDate(b) - this.getDate(a)); break;
      case 'oldest':
        this.displayedPodcasts.sort((a, b) => this.getDate(a) - this.getDate(b)); break;
      case 'longest':
        this.displayedPodcasts.sort((a, b) => (+b.duration || 0) - (+a.duration || 0)); break;
      case 'shortest':
        this.displayedPodcasts.sort((a, b) => (+a.duration || 0) - (+b.duration || 0)); break;
      case 'az':
        this.displayedPodcasts.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
      case 'za':
        this.displayedPodcasts.sort((a, b) => (b.title || '').localeCompare(a.title || '')); break;
    }
  }

  private getDate(p: IPodcast): number {
    if (!p.uploadDate) return 0;
    if (typeof p.uploadDate === 'string') return new Date(p.uploadDate).getTime();
    if ('toDate' in p.uploadDate) return p.uploadDate.toDate().getTime();
    return 0;
  }

  onChangeAvatarClick(input: HTMLInputElement) {
    if (!this.isOwnProfile) return;
    input.click();
  }
 async onAvatarSelected(event: Event) {
  if (!this.isOwnProfile || !this.currentUserId) return;
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const url = await this.uploadSvc.uploadUserImage(this.currentUserId, file, 'photo');
    console.log('Cloudinary OK:', url);
    this.flash('Profilna je ažurirana.');
  } catch (err: any) {
    console.error('Upload error:', err);
    this.flash(err?.message || 'Greška pri uploadu.');
  }
}

  onChangeBannerClick(input: HTMLInputElement) {
    if (!this.isOwnProfile) return;
    input.click();
  }
  async onBannerSelected(event: Event) {
  if (!this.isOwnProfile || !this.currentUserId) return;
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const url = await this.uploadSvc.uploadUserImage(this.currentUserId, file, 'banner');
    if (this.user) this.user.bannerURL = url;
    this.flash('Baner je ažuriran.');
  } catch (err) {
    console.error('Banner upload error:', err);
    this.flash('Greška pri uploadu banera.');
  } finally {
    input.value = '';
  }
}

 async toggleFollow() {
  if (!this.currentUserId || this.isOwnProfile) return;

  try {
    const isFollowing = await firstValueFrom(this.isFollowing$ ?? of(false));

    if (isFollowing) {
      await this.followService.unfollow(this.currentUserId, this.userId);
      this.flash('Uspešno ste otpratili korisnika.');
      console.log('Unfollowed user:', this.userId);
    } else {
      await this.followService.follow(this.currentUserId, this.userId);
      this.flash('Uspešno ste zapratili korisnika.');
      console.log('Followed user:', this.userId);
    }
  } catch (e) {
    console.error('toggleFollow error:', e);
    this.flash('Greška pri praćenju.');
  }
}

  private flash(msg: string) {
    this.flashMsg = msg;
    clearTimeout(this.flashTimer);
    this.flashTimer = setTimeout(() => (this.flashMsg = ''), 2200);
  }
}

