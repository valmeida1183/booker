import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthResponseData } from './authResponseData.model';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AlertComponent } from '../shared/alert/alert.component';
import * as fromApp from '../state-management/reducers/app.reducer';
import * as authActions from '../state-management/actions/auth.actions';

@Component({
  selector: 'bkr-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = null;
  @ViewChild(PlaceholderDirective) alerHost: PlaceholderDirective;

  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
   this.storeSub =  this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.errorMessage = authState.authError;
      if (this.errorMessage) {
        this.showErrorAlert(this.errorMessage);
      }
    });
  }

  onSwtichMode()  {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const { email, password } = form.value;

    if (this.isLoginMode) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(new authActions.LoginStart({ email, password }));
    } else {
      this.store.dispatch(new authActions.SignupStart({ email, password }));
    }

   /*  authObs.subscribe(responseData => {
      console.log(responseData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      console.error(errorMessage);
      this.errorMessage = errorMessage;
      this.showErrorAlert(errorMessage);
      this.isLoading = false;
    }); */

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new authActions.ClearError());
  }

  private showErrorAlert(message: string) {
    /*
      Este approach apresenta a instanciação de um componente via código, e controla sua aparição e remoção,
      em geral a abordagem mais usual é com ngIf ou até mesmo ngShow, mas aqui fica um exemplo com a criação
      dinâmica do componente de alerta.
    */

    // cria a classe que sabe como instanciar o component do type desejado da maneira que o angular faz.
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    // referência para o lugar onde o componente será injetado no DOM.
    const hostViewConteinerRef = this.alerHost.viewContainerRef;
    hostViewConteinerRef.clear();

    const componentRef = hostViewConteinerRef.createComponent(alertComponentFactory);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewConteinerRef.clear();
    });
  }


  ngOnDestroy() {
   if (this.closeSub) {
     this.closeSub.unsubscribe();
   }

   if (this.storeSub) {
     this.storeSub.unsubscribe();
   }
  }
}
