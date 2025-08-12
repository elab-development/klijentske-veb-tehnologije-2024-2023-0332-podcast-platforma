import { Component } from '@angular/core';
import { Navbar } from '../../shared/components/navbar/navbar';
import { GetPodcasts } from '../../core/services/podcast/get-podcasts';
import { GetUser } from '../../core/services/user/get-user';
import { IPodcast } from '../../core/interfaces/ipodcast';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-page',
  imports: [Navbar, CommonModule],
  templateUrl: './video-page.html',
  styleUrls: ['./video-page.css']
})
export class VideoPage {

  podcast?: IPodcast;
  embedUrl?: SafeResourceUrl;
  username?: string;
  profilePicUrl?: string;

  constructor( 
    private getPodcasts: GetPodcasts,
    private getUser: GetUser,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    const podcastId = this.route.snapshot.paramMap.get('id');
    if (podcastId) {
      this.getPodcasts.getPodcastById(podcastId).subscribe(podcast => {
        if (podcast) {
          this.podcast = podcast;
          const safeUrl = this.transformUrl(podcast.videoUrl);
          if (safeUrl) {
            this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
          } else {
            this.embedUrl = undefined;
          }
          if (podcast.uploadedBy) {
            this.getUser.getUserById(podcast.uploadedBy).subscribe(user => {
              if (user) {
                this.username = user.username;
                this.profilePicUrl = user.getProfilePic();
              }
            });
          }
        }
      });
    }
  }

  transformUrl(url: string): string | null {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    const videoId = match ? match[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
}
