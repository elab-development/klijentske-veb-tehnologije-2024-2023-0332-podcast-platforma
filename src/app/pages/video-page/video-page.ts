import { Component, inject, OnInit } from '@angular/core';
import { GetPodcasts } from '../../core/services/podcast/get-podcasts';
import { GetUser } from '../../core/services/user/get-user';
import { IPodcast } from '../../core/interfaces/ipodcast';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { PodcastCardComponent } from '../../shared/components/podcast-card/podcast-card';
import { FavoritesService } from '../../core/services/favorites/favorites-service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-video-page',
  imports: [ CommonModule, RouterModule, PodcastCardComponent],
  standalone: true,
  templateUrl: './video-page.html',
  styleUrls: ['./video-page.css']
})
export class VideoPage implements OnInit {

  podcast?: IPodcast;
  embedUrl?: SafeResourceUrl;
  username?: string;
  profilePicUrl?: string;
  recommendedPodcast?: IPodcast;
  recommendationMessage?: string;
  currentPodcastId?: string;
  router: any;
  isFav: boolean = false;

  private getPodcasts = inject(GetPodcasts);
  private getUser = inject(GetUser);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private favoritesService = inject(FavoritesService);
  private auth = inject(Auth);
  

 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.currentPodcastId = id;
      this.loadPodcast(id);

      this.auth.onAuthStateChanged(user => {
        if (user) {
          this.favoritesService.isFavorite$(id).subscribe(isFav => {
            this.isFav = isFav;
          });
        } else {
          this.isFav = false; 
        }
      });
    }
  });
}

  private loadPodcast(podcastId: string): void {
    this.getPodcasts.getPodcastById(podcastId).subscribe(podcast => {
      if (!podcast) return;

      this.podcast = podcast;
      const safeUrl = this.transformUrl(podcast.videoUrl);
      this.embedUrl = safeUrl
        ? this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl)
        : undefined;


      if (podcast.uploadedBy) {
        this.getUser.getUserById(podcast.uploadedBy).subscribe(user => {
          if (user) {
            this.username = user.username;
            this.profilePicUrl = user.getProfilePic();
            if (typeof podcast.uploadedBy === 'string') {
              this.loadRecommendedPodcast(podcast.uploadedBy);
            }
          }
        });
      }
    });
  }

  private loadRecommendedPodcast(userId: string): void {
    this.getPodcasts.getPodcastsByUserId(userId).subscribe(podcasts => {
      const otherPodcasts = podcasts.filter(p => p.id !== this.currentPodcastId);
      if (otherPodcasts.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherPodcasts.length);
        this.recommendedPodcast = otherPodcasts[randomIndex];
        this.recommendationMessage = 'Recommended Podcast';
      } else {
        this.recommendedPodcast = undefined;
        this.recommendationMessage = 'NEMA PREPORUČENIH PODKASTA';
      }
    });
  }

  private transformUrl(url: string): string | null {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    const videoId = match ? match[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
async toggleFavorite(): Promise<void> {
    console.log('Klik na zvezdicu', this.currentPodcastId);
    if (!this.currentPodcastId) return;

    const user = this.auth.currentUser;
    if (!user) {
      console.warn('User not logged in');
      return;
    }

    try {
      if (this.isFav) {
        this.isFav = false; // odmah menja boju
        await this.favoritesService.removeFromFavorites(this.currentPodcastId);
        console.log('Uklonjeno iz favorita');
      } else {
        this.isFav = true; // odmah menja boju
        await this.favoritesService.addToFavorites(this.currentPodcastId);
        console.log('Dodato u favorite');
      }
    } catch (err) {
      console.error(err);
    }
  }

}