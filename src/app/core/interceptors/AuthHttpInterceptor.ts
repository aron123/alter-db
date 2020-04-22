import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

    constructor(
        public tokenService: TokenService,
        public authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.startsWith('https://api.imgur.com/')) {
            req = req.clone({
                headers: req.headers.set('Authorization', 'Client-ID 595b4cc85fdb7a6')
            });

            return next.handle(req);
        }


        req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${this.tokenService.getToken()}`)
        });

        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    this.authService.logout();
                }

                return throwError(err);
            })
        );
    }
}
