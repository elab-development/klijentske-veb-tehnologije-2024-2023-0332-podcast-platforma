import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth-service';
import { Navbar } from '../../shared/components/navbar/navbar';
import { GetPodcasts } from '../../core/services/podcast/get-podcasts';
import { Podcast } from '../../core/interfaces/ipodcast';
import { CommonModule } from '@angular/common';
import { PodcastCardComponent } from '../../shared/components/podcast-card/podcast-card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [Navbar, CommonModule, PodcastCardComponent],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements OnInit {
  podcastsToShow: Podcast[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private getPodcasts: GetPodcasts
  ) {}

  ngOnInit(): void {
    this.getPodcasts.getAllPodcasts().subscribe(data => {
      console.log('Podcasts from firestore:', data);

      const sorted = data.sort((a, b) => {
        const dateA = a.uploadDate && 'toDate' in a.uploadDate
          ? a.uploadDate.toDate().getTime()
          : new Date(a.uploadDate).getTime();
        const dateB = b.uploadDate && 'toDate' in b.uploadDate
          ? b.uploadDate.toDate().getTime()
          : new Date(b.uploadDate).getTime();
        return dateB - dateA;
      });

      this.podcastsToShow = sorted.slice(0, 3);
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  trackByPodcastId(index: number, podcast: Podcast): string {
    return podcast.id ?? '';
  }
}
