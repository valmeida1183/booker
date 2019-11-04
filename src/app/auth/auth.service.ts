import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthResponseData } from './authResponseData.model';
import { User } from './user.model';
import { environment } from '../../environments/environment';
import * as fromApp from '../state-management/reducers/app.reducer';
import * as AuthActions from '../state-management/actions/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /* BehaviorSubject são ideais para representar valores através do tempo, basicamente recebe o valor do estado anterior */
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

 /*  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(
      // usando o operador catchError para capturar erros
      catchError(this.handleError),
      // Relembrando... o operador tap não interrompe, bloqueia ou altera o "observable chain",
      ele simplesmente permite rodar algum código com os dados retornados do observalbe./
      tap(responseData => {
        this.handleAuthentication(responseData);
      })
    );
  }
  */

  /* login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(responseData => {
        this.handleAuthentication(responseData);
      })
    );
  } */

  /* autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      // this.user.next(loadedUser);
      const { email, id, token } = loadedUser;
      this.store.dispatch(new AuthActions.AuthenticateSuccess({
          email,
          userId: id,
          token,
          expirationDate: new Date(userData._tokenExpirationDate)
        })
      );

      // caulcula o tempo restante que o token do user do localstorage está válido. (pois pode ter se logado a bastante tempo).
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  } */

  /* logout() {
    // this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  } */

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  /* private handleAuthentication(responseData: AuthResponseData) {
    const currentTime = new Date().getTime();
    const expirationDate = new Date(currentTime + (+responseData.expiresIn * 1000));
    const user = new User(responseData.email, responseData.localId, responseData.idToken, expirationDate);

    // this.user.next(user);
    this.store.dispatch(new AuthActions.AuthenticateSuccess({
        email: responseData.email,
        userId: responseData.localId,
        token: responseData.idToken,
        expirationDate
      })
    );
    this.autoLogout(+responseData.expiresIn * 1000);

    // salva no local storage o user inteiro
    localStorage.setItem('userData', JSON.stringify(user));
  } */

  /* private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error ocurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      // throwError para devolver um novo observalbe com um mensagem mais amigável.
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  } */
}
