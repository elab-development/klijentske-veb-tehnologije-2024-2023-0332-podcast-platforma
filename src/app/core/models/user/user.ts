import { IUser } from "../../interfaces/iuser";

export class User implements IUser {
    uid: string;
    email: string;
    username: string;
    photoURL?: string;
    bannerURL?: string; 
    createdAt?: Date;

    constructor(data: any) {
        this.uid = data.uid;
        this.email = data.email;
        this.username = data.username;
        this.photoURL = data.photoURL || '';
        this.bannerURL = data.bannerURL || '';
        this.createdAt = data.createdAt ? data.createdAt.toDate?.() || data.createdAt : undefined;
    }

    getProfilePic(): string {
        return this.photoURL || '/assets/img/user2.png';
    }
      getBannerPic(): string {
    return this.bannerURL || '/assets/img/banner.png';
  }
}
