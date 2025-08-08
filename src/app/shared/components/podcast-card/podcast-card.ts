import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPodcast } from '../../../core/interfaces/ipodcast';

@Component({
  selector: 'app-podcast-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './podcast-card.html',
  styleUrls: ['./podcast-card.css']
})
export class PodcastCardComponent {
  @Input() podcast!: IPodcast;

  get formattedDuration(): string {
    const duration = Number(this.podcast.duration);
    if (isNaN(duration)) return '0:00';

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  get formattedDate(): string {
    if (!this.podcast.uploadDate) return 'Nepoznat datum';

    let dateObj: Date;

    if (typeof this.podcast.uploadDate === 'object' && 'toDate' in this.podcast.uploadDate) {
      // Firestore Timestamp
      dateObj = this.podcast.uploadDate.toDate();
    } else {
      // String ili broj
      dateObj = new Date(this.podcast.uploadDate);
    }

    if (isNaN(dateObj.getTime())) {
      return 'Nepoznat datum';
    }

    return dateObj.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
