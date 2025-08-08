export interface IPodcast {
  id?: string;            
  title: string;           
  description: string;     
  audioUrl: string;       
  thumbnailUrl: string;    
  category: string;        
  duration: string;        
  uploadDate: any;         
  uploadedBy?: string;
}
