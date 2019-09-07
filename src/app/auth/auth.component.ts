import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthResponseData } from './authResponseData.model';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AlertComponent } from '../shared/alert/alert.component';

@Component({
  selector: 'bkr-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = null;
  closeSub: Subscription;
  @ViewChild(PlaceholderDirective) alerHost: PlaceholderDirective;


  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
  }

  onSwtichMode()  {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const { email, password } = form.value;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(responseData => {
      console.log(responseData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      console.error(errorMessage);
      this.errorMessage = errorMessage;
      this.showErrorAlert(errorMessage);
      this.isLoading = false;
    });

    form.reset();
  }

  onHandleError() {
    this.errorMessage = null;
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
  }
}
