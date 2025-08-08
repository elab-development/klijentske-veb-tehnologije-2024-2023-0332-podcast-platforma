import { IUser } from "../../interfaces/iuser";

export class User implements IUser {
    uid: string;
    email: string;
    username: string;
    photoURL?: string;
    createdAt?: Date;

    constructor(data: any) {
        this.uid = data.uid;
        this.email = data.email;
        this.username = data.username;
        this.photoURL = data.photoURL || '';
        this.createdAt = data.createdAt ? data.createdAt.toDate?.() || data.createdAt : undefined;
    }

    getProfilePic(): string {
        return this.photoURL || '/assets/img/user2.png';
    }
}
