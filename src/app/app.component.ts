import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthService } from './auth/auth.service';
import { LogginService } from './loggin.service';
import * as fromApp from './state-management/reducers/app.reducer';
import * as AuthActions from './state-management/actions/auth.actions';

@Component({
  selector: 'bkr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private logginService: LogginService,
    private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    // this.authService.autoLogin();
    this.store.dispatch(new AuthActions.AutoLogin());
    this.logginService.printLog('Hello from AppComponent ngOnInit');
  }
}
