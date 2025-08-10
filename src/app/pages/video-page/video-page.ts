import { Component } from '@angular/core';
import { Navbar } from '../../shared/components/navbar/navbar';
import { GetPodcasts } from '../../core/services/podcast/get-podcasts';
import { IPodcast } from '../../core/interfaces/ipodcast';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-video-page',
  imports: [Navbar, CommonModule],
  templateUrl: './video-page.html',
  styleUrls: ['./video-page.css']
})
export class VideoPage {

  podcast?: IPodcast;
  embedUrl?: SafeResourceUrl;

  constructor( 
    private getPodcasts: GetPodcasts,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    console.log('ID iz URL:', this.route.snapshot.paramMap.get('id'));

    const podcastId = this.route.snapshot.paramMap.get('id');
    if(podcastId){
      this.getPodcasts.getPodcastById(podcastId).subscribe(podcast => {
        if(podcast){
          this.podcast = podcast;
          const safeUrl = this.transformUrl(podcast.videoUrl);
          this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
        }
      });
    }
  }

  transformUrl(url: string): string {
    return url.replace('watch?v=', 'embed/');
  }
  
}
