import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects'; // "Actions" é um Onservable que lhe dá acesso a todas as ações depachadas.
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthResponseData } from '../authResponseData.model';
import { AuthService } from '../auth.service';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { User } from '../user.model';

// Effects no NgRx é utilizado para tratar "side Effects", que neste exemplo são Http Requests, manipalações no localStorage e roteamento.

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(responseData => {
                    const milisecondsExpirationTime = +responseData.expiresIn * 1000;
                    this.authService.setLogoutTimer(milisecondsExpirationTime);
                }),
                map(responseData => {
                    return this.handleAuthentication(responseData);
                }),
                catchError(errorResponse => {
                    return this.handleError(errorResponse);
                })
            );
        })
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START), // ofType operator do NgRx que filtra o tipo de Action que se quer tratar.
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(responseData => {
                    const milisecondsExpirationTime = +responseData.expiresIn * 1000;
                    this.authService.setLogoutTimer(milisecondsExpirationTime);
                }),
                map(responseData => {
                    return this.handleAuthentication(responseData);
                }),
                catchError(errorResponse => {
                    return this.handleError(errorResponse);
                })
            );
        })
    );

    @Effect({ dispatch: false }) // um effect que não produz um novo observable.
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
            if (authSuccessAction.payload.redirect) {
                this.router.navigate(['/']);
            }
        }));

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string,
                id: string,
                _token: string,
                _tokenExpirationDate: string
            } = JSON.parse(localStorage.getItem('userData'));

            if (!userData) {
                return { type: 'DUMMY' };
            }

            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );

            if (loadedUser.token) {
                // this.user.next(loadedUser);

                // caulcula o tempo restante que o token do user do localstorage está válido. (pois pode ter se logado a bastante tempo).
                const expirationDuration =
                    new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);

                const { email, id, token } = loadedUser;
                return new AuthActions.AuthenticateSuccess({
                    email,
                    userId: id,
                    token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                    redirect: false
                });
            }

            return { type: 'DUMMY' };
        })
    );

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    );

    // $ significa que é um Observalbe é um padrão do Ngrx, não é necessário nomear assim.
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) { }

    private handleAuthentication(responseData: AuthResponseData) {
        const currentTime = new Date().getTime();
        const expirationDate = new Date(currentTime + (+responseData.expiresIn * 1000));
        const user = new User(responseData.email, responseData.localId, responseData.idToken, expirationDate);
        localStorage.setItem('userData', JSON.stringify(user));

        return new AuthActions.AuthenticateSuccess({
            email: responseData.email,
            userId: responseData.localId,
            token: responseData.idToken,
            expirationDate,
            redirect: true
        });
    }

    private handleError(errorResponse: any) {
        /* 'of' vai criar um novo observable, pois um effect deve retornar um Observable,
            e o operador catchError ao contrário do map não produz um automaticamente */

        let errorMessage = 'An unknown error ocurred!';
        if (!errorResponse.error || !errorResponse.error.error) {
            // throwError para devolver um novo observalbe com um mensagem mais amigável.
            return of(new AuthActions.AuthenticateFail(errorMessage));
        }

        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exists';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct';
                break;
        }
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
}
