import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { GetPodcasts } from '../../core/services/podcast/get-podcasts';
import { IPodcast } from '../../core/interfaces/ipodcast';
import { PodcastCardComponent } from '../../shared/components/podcast-card/podcast-card';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, PodcastCardComponent],
  templateUrl: './search-page.html',
  styleUrls: ['./search-page.css'],
})
export class SearchPage {
  private route = inject(ActivatedRoute);
  private podcasts = inject(GetPodcasts);

  query$: Observable<string> = this.route.queryParamMap.pipe(
    map(p => (p.get('q') || '').trim())
  );

  results$: Observable<IPodcast[]> = this.query$.pipe(
    switchMap(q => {
      if (!q) return of<IPodcast[]>([]);
      return this.podcasts.getAllPodcasts().pipe(
        map(list =>
          list.filter(p => (p.title || '').toLowerCase().includes(q.toLowerCase()))
        )
      );
    })
  );
}
