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
      // --- Najnoviji ---
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

      // --- Preporučeni ---
      if (!favorites.length) {
        this.recommendedPodcasts = [];
        return;
      }

      // filtriramo samo ispravne string ID-ove iz favorites
      const favoriteIds = favorites
        .map(f => f.videoId)
        .filter((id): id is string => typeof id === 'string');

      // podkasti koji su u favorites (samo oni koji imaju ID)
      const favoritePodcasts = allPodcasts.filter(
        p => p.id && favoriteIds.includes(p.id)
      );

      // sve kategorije iz omiljenih
      const favoriteCategories = Array.from(
        new Set(favoritePodcasts.map(p => p.category).filter(Boolean))
      );

      // svi iz tih kategorija, ali nisu omiljeni
      const sameCategoryPodcasts = allPodcasts.filter(
        p => p.id &&
             favoriteCategories.includes(p.category) &&
             !favoriteIds.includes(p.id)
      );

      // nasumično izaberi do 3
      const shuffled = sameCategoryPodcasts
        .map(p => ({ p, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(obj => obj.p);

      this.recommendedPodcasts = shuffled.slice(0, 3);
    })
  )
  .subscribe();
}

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  trackByPodcastId(index: number, podcast: IPodcast): string {
    return podcast.id ?? '';
  }

  
}
