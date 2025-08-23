import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GetPodcasts } from '../../core/services/podcast/get-podcasts';
import { FavoritesService } from '../../core/services/favorites/favorites-service';
import { IPodcast } from '../../core/interfaces/ipodcast';
import { PodcastCardComponent } from '../../shared/components/podcast-card/podcast-card';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recommended-page',
  imports: [CommonModule, PodcastCardComponent, RouterModule],
  templateUrl: './recommended-page.html',
  styleUrl: './recommended-page.css',
  standalone: true
})
export class RecommendedPage {
  private podcastsSrv = inject(GetPodcasts);
  private favoritesSrv = inject(FavoritesService);

  allRecs: IPodcast[] = []; 
  visible: IPodcast[] = []; 
  loading = true;
  canLoadMore = false;

  ngOnInit() {
    combineLatest([
      this.podcastsSrv.getAllPodcasts(),
      this.favoritesSrv.getUserFavorites$()
    ])
    .pipe(
      map(([allPodcasts, favorites]) => {
        const favoriteIds = favorites
          .map(f => f.videoId)
          .filter((id): id is string => typeof id === 'string');

        const favPodcasts = allPodcasts.filter(p => p.id && favoriteIds.includes(p.id));
        const categories = Array.from(new Set(favPodcasts.map(p => p.category).filter(Boolean)));

        let recs = categories.length
          ? allPodcasts.filter(p => p.id && categories.includes(p.category) && !favoriteIds.includes(p.id))
          : [...allPodcasts];

        recs = recs.sort((a, b) => {
          const ad = (a.uploadDate?.toDate?.() ?? new Date(a.uploadDate ?? 0)).getTime();
          const bd = (b.uploadDate?.toDate?.() ?? new Date(b.uploadDate ?? 0)).getTime();
          return bd - ad;
        });

        this.allRecs = recs;
        this.visible = recs.slice(0, 6);
        this.canLoadMore = this.visible.length < this.allRecs.length;
        this.loading = false;
      })
    ).subscribe();
  }

  loadMore() {
    if (!this.canLoadMore) return;
    const next = this.visible.length + 3;
    this.visible = this.allRecs.slice(0, next);
    this.canLoadMore = this.visible.length < this.allRecs.length;
  }

  trackById = (_: number, p: IPodcast) => p.id ?? '';
}