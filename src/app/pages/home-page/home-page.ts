import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { GetPodcasts } from '../../core/services/podcast/get-podcasts';
import { IPodcast } from '../../core/interfaces/ipodcast';
import { CommonModule } from '@angular/common';
import { PodcastCardComponent } from '../../shared/components/podcast-card/podcast-card';
import { FavoritesService } from '../../core/services/favorites/favorites-service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, PodcastCardComponent, RouterModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements OnInit {
  podcastsToShow: IPodcast[] = [];
  recommendedPodcasts: IPodcast[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private getPodcasts: GetPodcasts,
    private favoritesService: FavoritesService 
  ) {}

  ngOnInit(): void {
  combineLatest([
    this.getPodcasts.getAllPodcasts(),
    this.favoritesService.getUserFavorites$()
  ])
  .pipe(
    map(([allPodcasts, favorites]) => {
      const sorted = [...allPodcasts].sort((a, b) => {
        const dateA = a.uploadDate && 'toDate' in a.uploadDate
          ? a.uploadDate.toDate().getTime()
          : new Date(a.uploadDate).getTime();
        const dateB = b.uploadDate && 'toDate' in b.uploadDate
          ? b.uploadDate.toDate().getTime()
          : new Date(b.uploadDate).getTime();
        return dateB - dateA;
      });
      this.podcastsToShow = sorted.slice(0, 3);

      if (!favorites.length) {
        this.recommendedPodcasts = [];
        return;
      }

      const favoriteIds = favorites
        .map(f => f.videoId)
        .filter((id): id is string => typeof id === 'string');

      const favoritePodcasts = allPodcasts.filter(
        p => p.id && favoriteIds.includes(p.id)
      );

      const favoriteCategories = Array.from(
        new Set(favoritePodcasts.map(p => p.category).filter(Boolean))
      );

      const sameCategoryPodcasts = allPodcasts.filter(
        p => p.id &&
             favoriteCategories.includes(p.category) &&
             !favoriteIds.includes(p.id)
      );

      const shuffled = sameCategoryPodcasts
        .map(p => ({ p, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(obj => obj.p);

      this.recommendedPodcasts = shuffled.slice(0, 3);
    })
  )
  .subscribe();
}

  trackByPodcastId(index: number, podcast: IPodcast): string {
    return podcast.id ?? '';
  }

  
}
