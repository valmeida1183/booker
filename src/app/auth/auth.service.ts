import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { AuthResponseData } from './authResponseData.model';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /* BehaviorSubject são ideais para representar valores através do tempo, basicamente recebe o valor do estado anterior */
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAKWqApDhZK8Y98rtRtPaAr21IxEXYeJzE',
      {
        email,
        password,
        returnSecureToken: true
      }
      // usando o operador catchError para capturar erros
    ).pipe(
      catchError(this.handleError),
      /* Relembrando... o operador tap não interrompe, bloqueia ou altera o "observable chain",
      ele simplesmente permite rodar algum código com os dados retornados do observalbe.*/
      tap(responseData => {
        this.handleAuthentication(responseData);
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAKWqApDhZK8Y98rtRtPaAr21IxEXYeJzE',
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
  }

  autoLogin() {
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
      this.user.next(loadedUser);

      // caulcula o tempo restante que o token do user do localstorage está válido. (pois pode ter se logado a bastante tempo).
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(responseData: AuthResponseData) {
    const currentTime = new Date().getTime();
    const expirationDate = new Date(currentTime + (+responseData.expiresIn * 1000));
    const user = new User(responseData.email, responseData.localId, responseData.idToken, expirationDate);

    this.user.next(user);
    this.autoLogout(+responseData.expiresIn * 1000);

    // salva no local storage o user inteiro
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
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
  }
}
