import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';

import { AuthService } from './auth/auth.service';
import { LogginService } from './loggin.service';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'bkr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private logginService: LogginService,
    private store: Store<fromApp.AppState>,
    // Exemplo de como injetar o valor de uma constante fornecida pelo Angular
    @Inject(PLATFORM_ID) private platformId ) {}

  ngOnInit() {
    /* Forma de verificar se o angular está sendo renderizado no Browser ou no Server (Angular Universal)
       Pois o Autologin verifica dados no localstorage, que é um recurso do browser e não estará disponível
       quando a página inicial for renderizada no server */
    if (isPlatformBrowser(this.platformId)) {
      // this.authService.autoLogin();
      this.store.dispatch(new AuthActions.AutoLogin());
    }

    this.logginService.printLog('Hello from AppComponent ngOnInit');
  }
}
