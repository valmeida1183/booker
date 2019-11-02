import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import { take, exhaustMap, map } from 'rxjs/operators';
import * as fromApp from '../state-management/reducers/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      // Operador take diz que você só quer "n" valores de um obserevalbe e depois ele é unsubscribed. No caso pega o último user
      take(1),
      map(authState => {
        return authState.user;
      }),
      /* Operador exhaustMap espera pelo observable anterior da cadeia completar (User que veio de take)
         depois disso Substitui toda a cadeia de observables pelo observable que ELE VAI RETORNAR (um Observable Http)*/
      exhaustMap(user => {
        if (!user) {
          return next.handle(request);
        }

        const modifiedRequest = request.clone({
          params: new HttpParams().set('auth', user.token)
        });

        return next.handle(modifiedRequest);
      }));
  }
}
