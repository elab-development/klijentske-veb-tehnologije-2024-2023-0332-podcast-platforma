import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetPodcasts } from '../../../core/services/podcast/get-podcasts';
import { IPodcast } from '../../../core/interfaces/ipodcast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PodcastCardComponent } from '../podcast-card/podcast-card';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PodcastCardComponent],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class Category {
  categoryId!: string;
  podcastsToShow: IPodcast[] = [];
  sortOption: string = '';
  categoryName: string = '';

  constructor(private route: ActivatedRoute, private getPodcasts: GetPodcasts) {}

 ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id') || '';
      this.categoryName = this.formatCategoryName(this.categoryId);
      this.loadPodcasts();
    });
  }

  loadPodcasts() {
    this.getPodcasts.getAllPodcasts().subscribe(all => {
      this.podcastsToShow = all.filter(p => p.category === this.categoryId);
      this.sortPodcasts();
    });
  }

  private formatCategoryName(id: string): string {
    if (!id) return '';
    return id.charAt(0).toUpperCase() + id.slice(1);
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
    if (typeof podcast.uploadDate === 'string') return new Date(podcast.uploadDate).getTime();
    if ('toDate' in podcast.uploadDate) return podcast.uploadDate.toDate().getTime();
    return 0;
  }

  trackByPodcastId(index: number, podcast: IPodcast): string {
    return podcast.id ?? '';
  }
}
