import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

export class User {
    constructor(
        public id: number,
        public nick: string,
        public email: string,
        public password: string) { }
}

@Injectable({
    providedIn: 'root'
})
export class UserAdapter implements Adapter<User> {

    back(user: User): any {
        return {
            id: user.id,
            nick: user.nick,
            email: user.email,
            password: user.password
        };
    }

    adapt(user: any): User {
        return new User(
            user.id,
            user.nick,
            user.email,
            user.password || ''
        );
    }
}
