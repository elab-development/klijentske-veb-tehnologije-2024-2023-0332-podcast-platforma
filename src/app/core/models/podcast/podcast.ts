import { IPodcast } from "../../interfaces/ipodcast";


export class Podcast implements IPodcast {
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  duration: string;
  uploadDate: any;
  uploadedBy?: string;

  constructor(data: IPodcast) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.videoUrl = data.videoUrl;
    this.thumbnailUrl = data.thumbnailUrl;
    this.category = data.category;
    this.duration = data.duration;
    this.uploadDate = data.uploadDate;
    this.uploadedBy = data.uploadedBy;
  }
}
