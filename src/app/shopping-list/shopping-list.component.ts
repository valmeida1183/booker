import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import { LogginService } from '../loggin.service';
import * as ShoppingListActions from './store/shopping-list.action';
import * as fromApp from '../store/app.reducer';

@Component({
    selector: 'bkr-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    ingredients: Observable<{ ingredients: Ingredient[]}>;
    private subscription: Subscription;

    constructor(
        // private shoppingListService: ShoppingListService, -> Este serviço foi substituido pela abordagem do Ngrx
        private loggingService: LogginService,
        private store: Store<fromApp.AppState>) { }

    ngOnInit() {
        // recebendo valores do objeto 'shoppingList' alocado na store do NgRx (Retorna um observable)
        this.ingredients = this.store.select('shoppingList');
        /* this.ingredients = this.shoppingListService.getIngredients();
        this.subscription = this.shoppingListService.ingredientsChanged
            .subscribe((ingredients: Ingredient[]) => {
             this.ingredients = ingredients;
        }); */

        this.loggingService.printLog('Hello from ShoppngListComponent ngOnInit!');
    }

    ngOnDestroy() {
        // this.subscription.unsubscribe();
    }

    onEditItem(index: number) {
        /* this.shoppingListService.startedEditing.next(index); */
        this.store.dispatch(new ShoppingListActions.StartEdit(index));
    }
}
