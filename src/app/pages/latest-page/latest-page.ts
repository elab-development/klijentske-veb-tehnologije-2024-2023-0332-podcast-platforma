import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GetPodcasts } from '../../core/services/podcast/get-podcasts';
import { IPodcast } from '../../core/interfaces/ipodcast';
import { PodcastCardComponent } from '../../shared/components/podcast-card/podcast-card';
import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-latest-page',
  imports: [CommonModule, PodcastCardComponent, RouterModule],
  templateUrl: './latest-page.html',
  styleUrl: './latest-page.css',
  standalone: true
})
export class LatestPage {
 private podcasts = inject(GetPodcasts);

  items: IPodcast[] = [];
  cursor: QueryDocumentSnapshot<DocumentData> | null = null;
  loading = false;
  canLoadMore = true;

  async ngOnInit() {
    await this.loadInitial();
  }

  async loadInitial() {
    this.items = [];
    this.cursor = null;
    this.canLoadMore = true;
    await this.loadMore(6); 
  }

  async loadMore(size = 3) {  
    if (this.loading || !this.canLoadMore) return;
    this.loading = true;
    try {
      const { items, lastDoc } = await this.podcasts.getLatestPage(size, this.cursor);
      this.items.push(...items);
      this.cursor = lastDoc;
      this.canLoadMore = !!lastDoc && items.length > 0;
    } finally {
      this.loading = false;
    }
  }

  trackById = (_: number, p: IPodcast) => p.id ?? '';
}
