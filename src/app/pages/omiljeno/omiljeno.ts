import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { GetPodcasts } from '../../core/services/podcast/get-podcasts';
import { FavoritesService } from '../../core/services/favorites/favorites-service';
import { IPodcast } from '../../core/interfaces/ipodcast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PodcastCardComponent } from '../../shared/components/podcast-card/podcast-card';

@Component({
  selector: 'app-omiljeno',
  standalone: true,
  imports: [CommonModule, FormsModule, PodcastCardComponent, RouterModule],
  templateUrl: './omiljeno.html',
  styleUrl: './omiljeno.css'
})
export class Omiljeno implements OnInit {
  podcastsToShow: IPodcast[] = [];
  sortOption: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private getPodcasts: GetPodcasts,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.favoritesService.getUserFavorites$().subscribe(favs => {
      const favIds = favs.map(f => f.videoId);

      this.getPodcasts.getAllPodcasts().subscribe(allPodcasts => {
        this.podcastsToShow = allPodcasts.filter(p => favIds.includes(p.id ?? ''));
        this.sortPodcasts();
      });
    });
  }

  sortPodcasts() {
    switch (this.sortOption) {
      case 'newest':
        this.podcastsToShow.sort((a, b) => this.getDate(b) - this.getDate(a));
        break;
      case 'oldest':
        this.podcastsToShow.sort((a, b) => this.getDate(a) - this.getDate(b));
        break;
     case 'longest':
        this.podcastsToShow.sort((a, b) => (Number(b.duration) || 0) - (Number(a.duration) || 0));
        break;
      case 'shortest':
        this.podcastsToShow.sort((a, b) => (Number(a.duration) || 0) - (Number(b.duration) || 0));
        break;
      case 'az':
        this.podcastsToShow.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'za':
        this.podcastsToShow.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
    }
  }

 private getDate(podcast: IPodcast): number {
  if (!podcast.uploadDate) return 0;

  if (typeof podcast.uploadDate === 'string') {
    const time = new Date(podcast.uploadDate).getTime();
    return isNaN(time) ? 0 : time;
  }

  if ('toDate' in podcast.uploadDate) {
    const time = podcast.uploadDate.toDate().getTime();
    return isNaN(time) ? 0 : time;
  }

  return 0;
}

  trackByPodcastId(index: number, podcast: IPodcast): string {
    return podcast.id ?? '';
  }
}
